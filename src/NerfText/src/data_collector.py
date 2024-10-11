from collections import defaultdict
from tqdm import tqdm
import os
import numpy as np
import torch
from utils_ema.general import load_class_from_path, load_function_from_path
from pathlib import Path
from utils_ema.config_utils import load_yaml
from utils_ema.general import load_class_from_path
from utils_ema.objects import Object
from utils_ema.diff_renderer import Renderer
from utils_ema.image import Image
from utils_ema.texture import Texture
from utils_ema.memory_mapped import save_memory_mapped_arr, load_memory_mapped_arr


class DataCollector:

    def __init__(self, cfg):
        self.cfg = cfg
        self.device = torch.device(self.cfg.collect.device)
        self.data_nerf = None

    def _collect_images(self, dict_coll):
        # collector
        # use collector to collect images
        print(self.cfg.paths.collector_dir)
        Collector = load_class_from_path(
            Path(self.cfg.paths.collector_dir, "collect.py"), "Collector"
        )
        cl = Collector(dict_coll.collector_cfg, self.cfg.paths.led_cfg)
        if dict_coll.type == "collect_video":
            cl.collect_video(debug=True, range_ids=dict_coll.range_pose_ids)
        elif dict_coll.type == "collect_manual_while_track":
            # cl.collect_while_tracking(manual=True, debug=True)
            cl.collect_manual()

        self.images = None

    def _get_cams_objs_imgs(self, dict_coll):

        # get calibrated cameras
        collector_cfg = load_yaml(dict_coll.collector_cfg)
        calib_dir = collector_cfg.paths.calib_data_dir
        dl = load_function_from_path(
            os.path.join(calib_dir, "data_loader.py"), "get_data_loader"
        )()
        cams = dl.get_cameras_from_calib_data(device=self.device)

        # get objects
        mesh_ref = Object(mesh=self.cfg.paths.mesh_path).mesh
        dl = load_class_from_path(
            os.path.join(self.cfg.paths.collector_dir, "load.py"), "CollectorLoader"
        )(dict_coll.collector_cfg)
        poses = dl.get_poses()
        objects = []
        for cam_id in range(len(cams)):
            objects.append([])
            for pose_id, pose in enumerate(poses):
                obj = Object(mesh=mesh_ref, pose=pose[cam_id], device=self.device)
                objects[-1].append(obj)

        # # get images
        # images = dl.get_images(device=self.device)
        # images = list(images.values())
        # images = [list(img_list.values()) for img_list in images]
        # return cams, objects, images
        #
        # get images generator
        images_gen = dl.get_images_gen(device=self.device)

        return cams, objects, images_gen

    def _collect_uvs_and_img_vals(self, cam, obj, img):
        gbuffers, pixs, _ = Renderer().get_buffers_pixels_dirs(
            cam, obj, channels=["mask", "uv"], with_antialiasing=False
        )

        uv_gbuf = gbuffers["uv"].to(self.device)
        pixs = pixs.to(uv_gbuf.device)

        # # # debug uv
        # uv_img = torch.zeros(list(gbuffers["uv"].shape)[:-1] + [3]).to("cuda")
        # uv_img[..., :2] = gbuffers["uv"]
        # uv = Image(uv_img)
        # img.show(wk=0)
        # uv.show(wk=0)

        uv_vals = uv_gbuf[pixs[:, 1], pixs[:, 0]]
        img_vals = img.img[pixs[:, 1], pixs[:, 0], :]

        return uv_vals, img_vals

    def _save_data(self, data, subfolder):
        print("Saving data")
        for i, d in enumerate(data.values()):
            out_dir = os.path.join(self.cfg.paths.save_data, subfolder, str(i).zfill(3))
            if not os.path.exists(out_dir):
                os.makedirs(out_dir)

            d["input"] = torch.cat(d["input"], dim=0)
            d["output"] = torch.cat(d["output"], dim=0)
            d = torch.stack([d["input"], d["output"]], dim=1)
            save_memory_mapped_arr(
                d,
                out_dir,
                "nerf_data",
                dtype=np.float32,
            )

    def load_data(self, subfolder, cam_id):

        path = Path(
            os.path.join(
                self.cfg.paths.save_data,
                subfolder,
                str(cam_id).zfill(3),
                "nerf_data.bin",
            )
        )
        if os.path.exists(path):
            data = load_memory_mapped_arr(
                str(path.parent), str(path.stem), dtype=np.float32
            )
            return data
        else:
            raise FileNotFoundError(f"Path {path} not found")

    def _collect_training_data(self, dict_coll):

        # nerf data
        data_nerf = {}

        cams, objs, imgs = self._get_cams_objs_imgs(dict_coll=dict_coll)

        # for each cam
        for cam_id, obj_list in enumerate(objs):

            data_nerf[cam_id] = {"input": [], "output": []}

            cam = list(cams.values())[cam_id]
            for img_id, obj in enumerate(
                tqdm(obj_list, leave=False, desc=f"imgs, cam: {cam_id}")
            ):

                rng = self.cfg.collect.train.img_id_range
                if img_id in range(rng[0], rng[1]):

                    # img = imgs[cam_id][img_id]
                    img = next(imgs)

                    # get uvs (input) and vals (output)
                    uvs, vals = self._collect_uvs_and_img_vals(cam, obj, img)

                    # # debug texture
                    # texture = Texture.init_from_uvs(
                    #     uvs, vals, self.cfg.collect.texture_res
                    # )
                    # texture.show()

                    # append nerf data
                    x = obj.pose.location()[0]
                    data_nerf[cam_id]["input"].append(
                        torch.cat([x.repeat(uvs.shape[0], 1), uvs], dim=-1)
                    )
                    data_nerf[cam_id]["output"].append(vals)

        # save
        self._save_data(data_nerf, subfolder=dict_coll.subfolder)

    def collect_data(self):

        ##### TRAIN

        # collect images
        if self.cfg.collect.train.collect_images:
            self._collect_images(self.cfg.collect.train)

        # collect training data
        if self.cfg.collect.train.collect_training_data:
            self._collect_training_data(self.cfg.collect.train)

        ##### EVAL

        # collect images
        if self.cfg.collect.eval.collect_images:
            self._collect_images(self.cfg.collect.eval)

        # collect training data
        if self.cfg.collect.eval.collect_training_data:
            self._collect_training_data(self.cfg.collect.eval)
