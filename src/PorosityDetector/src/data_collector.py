from collections import defaultdict
import h5py
import shutil
from tqdm import tqdm
import os
import numpy as np
import torch
from pathlib import Path
from utils_ema.general import load_class_from_path, load_function_from_path
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

        # copy save_dir content (folders and files) in save_dir parent
        save_dir = Path(load_yaml(dict_coll.collector_cfg).paths.save_dir)
        save_dir_new = save_dir.parent / str(
            len(list(save_dir.parent.iterdir())) - 1
        ).zfill(3)
        os.makedirs(save_dir_new)
        for file in save_dir.iterdir():
            shutil.move(str(file), str(save_dir_new / file.name))
        shutil.rmtree(save_dir)

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
        images_gen = dl.get_images_gen(device=self.device, dtype=torch.float32)

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

    # def load_data_array(self, subfolder, channels=3):
    #     out_dir = Path(os.path.join(self.cfg.paths.save_data, subfolder))
    #     out_dir_patch = Path(out_dir / "patches")
    #     patch_dir = sorted(out_dir_patch.iterdir())
    #     data = []
    #     for patch_path in patch_dir:
    #         data.append(torch.load(str(patch_path)))
    #     if channels == 1:
    #         data = [d.mean(dim=1, keepdim=True) for d in data]
    #     return torch.cat(data, dim=0)
    #
    # def load_data_generator(self, subfolder, channels=3):
    #     out_dir = Path(os.path.join(self.cfg.paths.save_data, subfolder))
    #     out_dir_patch = Path(out_dir / "patches")
    #     patch_dir = sorted(out_dir_patch.iterdir())
    #     for patch_path in patch_dir:
    #         patches = torch.load(str(patch_path))
    #         if channels == 1:
    #             patches = patches.mean(dim=1, keepdim=True)
    #         yield patches

    def _collect_training_data(self, dict_coll):

        out_dir = Path(os.path.join(self.cfg.paths.save_data, dict_coll.subfolder))
        save_dir_coll = Path(load_yaml(dict_coll.collector_cfg).paths.save_dir).parent
        tmp_dir = Path(save_dir_coll / "tmp")
        shutil.rmtree(tmp_dir, ignore_errors=True)
        mask_material = Texture.init_from_path(self.cfg.paths.mask_path)
        out_dir_patch = Path(out_dir / "patches")
        shutil.rmtree(out_dir_patch, ignore_errors=True)
        os.makedirs(out_dir_patch)
        os.makedirs(str(out_dir_patch / "x"), exist_ok=True)
        os.makedirs(str(out_dir_patch / "y"), exist_ok=True)
        os.makedirs(str(out_dir_patch / "id"), exist_ok=True)

        for d in save_dir_coll.iterdir():

            if not dict_coll.compute_textures:
                break

            if d.stem == "tmp":
                continue

            # get d filename
            out_dir_tex = Path(out_dir / "textures" / d.stem)
            shutil.rmtree(out_dir_patch, ignore_errors=True)
            shutil.rmtree(out_dir_tex, ignore_errors=True)
            os.makedirs(out_dir_tex, exist_ok=True)
            os.makedirs(out_dir_patch, exist_ok=True)
            shutil.copytree(d, tmp_dir)

            # id = len(list(out_dir_tex.iterdir()))

            cams, objs, imgs = self._get_cams_objs_imgs(dict_coll=dict_coll)
            mask_obj = (
                objs[0][0]
                .mesh.get_texture_mask(res=mask_material.img.shape[0])
                .unsqueeze(-1)
            )

            # for each cam
            for cam_id, obj_list in enumerate(tqdm(objs)):

                cam = list(cams.values())[cam_id]
                for img_id, obj in enumerate(
                    tqdm(obj_list, leave=False, desc=f"imgs, cam: {cam_id}")
                ):

                    rng = dict_coll.img_id_range
                    if img_id in tqdm(range(rng[0], rng[1]), leave=False):

                        # get texture
                        img = next(imgs)

                        uvs, vals = self._collect_uvs_and_img_vals(cam, obj, img)
                        texture = Texture.init_from_uvs(
                            uvs, vals, self.cfg.collect.texture_res
                        )
                        if dict_coll.masked:
                            texture.img *= mask_material.img

                        # # fill operation
                        # texture = texture.inpaint()
                        #

                        # fill operation
                        for _ in range(self.cfg.train.fill_iterations):
                            texture = texture.fill_black_pixels(
                                device="cuda",
                                kernel_size=self.cfg.train.fill_kernel,
                                nerby_nonzero_pixels=self.cfg.train.fill_nn,
                            )
                        for _ in range(self.cfg.train.fill_iterations):
                            texture = texture.fill_black_pixels(
                                device="cuda",
                                kernel_size=self.cfg.train.fill_kernel,
                                nerby_nonzero_pixels=self.cfg.train.fill_nn,
                                reverse=True,
                            )

                        texture.img *= mask_obj

                        # debug and save texture
                        texture.show(wk=1)
                        texture.save(
                            str(
                                out_dir_tex
                                / (
                                    str(cam_id).zfill(3)
                                    + "_"
                                    + str(img_id).zfill(3)
                                    + ".png"
                                )
                            )
                        )

            shutil.rmtree(tmp_dir, ignore_errors=True)

        labels_dir = Path(self.cfg.paths.save_data) / "labels" / dict_coll.subfolder
        for i, tex_dir in enumerate(
            tqdm(
                sorted(Path(out_dir / "textures").iterdir()),
                desc="computing patches",
            )
        ):

            data_dir_x = str(out_dir_patch / "x" / (str(i).zfill(2) + ".h5"))
            data_dir_y = str(out_dir_patch / "y" / (str(i).zfill(2) + ".h5"))
            data_dir_id = str(out_dir_patch / "id" / (str(i).zfill(2) + ".h5"))
            with h5py.File(data_dir_x, "w") as hdf_x:
                with h5py.File(data_dir_y, "w") as hdf_y:
                    with h5py.File(data_dir_id, "w") as hdf_id:
                        c = 0

                        if labels_dir.exists():
                            label = Image(
                                path=str(sorted(labels_dir.iterdir())[i]),
                                dtype=torch.float32,
                            )
                            patches_label_tot = label.patchify(
                                self.cfg.train.patch_size,
                                self.cfg.train.stride_factor,
                            )
                            patches_label_tot = patches_label_tot.permute(0, 3, 1, 2)[
                                :, :1, ...
                            ]
                        else:
                            patches_label_tot = None

                        for tex_path in sorted(tex_dir.iterdir()):
                            texture = Image(path=str(tex_path), dtype=torch.float32)

                            # extract patches
                            patches = texture.patchify(
                                self.cfg.train.patch_size,
                                self.cfg.train.stride_factor,
                                device=self.device,
                            )

                            patches = patches.permute(0, 3, 1, 2)
                            ids = torch.arange(patches.size(0))
                            ratio = (patches != 0).sum(dim=(1, 2, 3)) / (
                                patches[0].numel()
                            )
                            patches = patches[ratio > self.cfg.collect.min_patch_ratio]
                            ids = ids[ratio > self.cfg.collect.min_patch_ratio]
                            if patches_label_tot is not None:
                                patches_label = patches_label_tot[
                                    ratio > self.cfg.collect.min_patch_ratio
                                ]

                            for id, patch in enumerate(patches):
                                if patches_label_tot is None:
                                    label_patch = torch.zeros_like(patch[:1, ...])
                                else:
                                    label_patch = patches_label[id]
                                hdf_x.create_dataset(
                                    f"{c}",
                                    data=(patch.numpy()),
                                )
                                hdf_id.create_dataset(
                                    f"{c}",
                                    data=(ids[id]),
                                )
                                if dict_coll.has_labels:
                                    hdf_y.create_dataset(
                                        f"{c}",
                                        data=(label_patch.numpy()),
                                    )
                                c += 1

    def collect_data(self):

        ##### TRAIN

        # collect images
        if self.cfg.collect.train.collect_images:
            self._collect_images(self.cfg.collect.train)

        # collect training data
        if self.cfg.collect.train.collect_training_data:
            self._collect_training_data(self.cfg.collect.train)

        #### EVAL

        # collect images
        if self.cfg.collect.eval.collect_images:
            self._collect_images(self.cfg.collect.eval)

        # collect training data
        if self.cfg.collect.eval.collect_training_data:
            self._collect_training_data(self.cfg.collect.eval)

    def collect_data_realtime(self):

        # collect images
        if self.cfg.collect.eval_realtime.collect_images:
            self._collect_images(self.cfg.collect.eval_realtime)

        # collect training data
        if self.cfg.collect.eval_realtime.collect_training_data:
            self._collect_training_data(self.cfg.collect.eval_realtime)
        pass
