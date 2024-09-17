from collections import defaultdict
import os
import torch
from utils_ema.general import load_class_from_path, load_function_from_path
from pathlib import Path
from utils_ema.config_utils import load_yaml
from utils_ema.general import load_class_from_path
from utils_ema.objects import Object
from utils_ema.diff_renderer import Renderer
from utils_ema.image import Image
from utils_ema.texture import Texture


class DataCollector:

    def __init__(self, cfg):
        self.cfg = cfg
        self.device = torch.device(self.cfg.collect.device)
        self.data_nerf = None

    def _collect_images(self):
        # collector
        # use collector to collect images
        print(self.cfg.paths.collector_dir)
        Collector = load_class_from_path(
            Path(self.cfg.paths.collector_dir, "collect.py"), "Collector"
        )
        cl = Collector(self.cfg.paths.collector_cfg, self.cfg.paths.led_cfg)
        cl.collect_video(debug=True)

        self.images = None

    def _get_cams_objs_imgs(self):

        # get calibrated cameras
        collector_cfg = load_yaml(self.cfg.paths.collector_cfg)
        calib_dir = collector_cfg.paths.calib_data_dir
        dl = load_function_from_path(
            os.path.join(calib_dir, "data_loader.py"), "get_data_loader"
        )()
        cams = dl.get_cameras_from_calib_data(device=self.device)

        # get objects
        mesh_ref = Object(mesh=self.cfg.paths.mesh_path).mesh
        dl = load_class_from_path(
            os.path.join(self.cfg.paths.collector_dir, "load.py"), "CollectorLoader"
        )(self.cfg.paths.collector_cfg)
        poses = dl.get_poses()
        objects = []
        for cam_id in range(len(cams)):
            objects.append([])
            for pose in poses:
                obj = Object(mesh=mesh_ref, pose=pose[cam_id], device=self.device)
                objects[-1].append(obj)

        # get images
        images = dl.get_images(device=self.device)
        images = list(images.values())
        images = [list(img_list.values()) for img_list in images]

        return cams, objects, images

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

    def _save_nerf_data(self, uvs, vals, obj):

        # nerf data
        if self.data_nerf is None:
            self.data_nerf = []

        # get x
        x = obj.pose.location()[0]

    def collect_training_data(self):

        cams, objs, imgs = self._get_cams_objs_imgs()

        # for each cam
        for cam_id, obj_list in enumerate(objs):

            cam = list(cams.values())[cam_id]
            for img_id, obj in enumerate(obj_list):

                img = imgs[cam_id][img_id]

                # get uvs (input) and vals (output)
                uvs, vals = self._collect_uvs_and_img_vals(cam, obj, img)

                # debug texture
                texture = Texture.init_from_uvs(uvs, vals, self.cfg.collect.texture_res)
                texture.show()

                # save nerf data
                self._save_nerf_data(uvs, vals, obj)

    def collect_data(self):

        # collect images
        if self.cfg.collect.collect_images:
            self._collect_images()

        # collect training data
        if self.cfg.collect.collect_training_data:
            self.collect_training_data()
