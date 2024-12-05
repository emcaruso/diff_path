import sys, os
from cv2.gapi import mask
import numpy as np
import cv2
import time
import torch
from torch.nn import parameter
from torch.nn.modules import distance
from torch.optim import optimizer
from tqdm import tqdm
import argparse
from utils_ema.config_utils import load_yaml
from utils_ema.geometry_pose import Pose
from utils_ema.image import Image
from utils_ema.torch_utils import clear_cuda_tensors
from image_collector import ImageCollector
from obj_loader import ObjLoader
from renderer import Renderer
from saver import Saver
from realign import Realigner
import torch.nn.functional as F


script_dir = os.path.dirname(os.path.realpath(__file__))
configs_dir = os.path.abspath(os.path.join(script_dir, "..", "configs"))
config_default = os.path.abspath(os.path.join(configs_dir, "edged_pose_estim.yaml"))


class Program:
    def __init__(self, opt):
        self.opt = opt
        self.cfg = load_yaml(self.opt.config_path)
        self.cfg.config_path = self.opt.config_path
        self.init()
        self.ec = None
        self.saver = Saver(self.cfg)

        if self.cfg.with_boards:
            sys.path.append(self.cfg.paths.calib_src)
            from extrinsics_correction import ExtrinsicsCorrection

            calib_cfg = load_yaml(self.cfg.paths.calib_cfg)
            self.ec = ExtrinsicsCorrection(calib_cfg, True)

    def init(self):

        # load calibrated scene
        sys.path.append(self.cfg.paths.data_in_dir)
        from data_loader import get_data_loader

        self.scene = get_data_loader().get_scene()

        # load images and distance maps
        self.images, self.dist_maps = ImageCollector(
            self.cfg
        ).get_images_and_distmaps()  # list of lists [n_cameras][n_frames]

        # load mesh in the scene
        # self.obj = ObjLoader(self.cfg).get_obj()
        # self.object_poses = [Pose(T=torch.eye(4)) for _ in range(len(self.images[0]))]
        self.objects = ObjLoader(self.cfg).get_objects()
        self.scene.set_objects([self.objects])

        # diff renderer
        self.renderer = Renderer(self)

    def _set_device(self, device):
        for cam in self.scene.get_cams():
            cam = cam.to(self.cfg.opt.device)
        for obj in self.objects:
            obj = obj.to(self.cfg.opt.device)
        for dist_map in self.dist_maps:
            for img in dist_map:
                img = img.to(self.cfg.opt.device)
        for image in self.images:
            for img in image:
                img = img.to(self.cfg.opt.device)
        for board in self.scene.boards:
            board.set_device(device)
        if self.ec is not None:
            self.ec.set_device(self.cfg.opt.device)

    def edged_pose_estim_step(self, it, wk=1):

        loss_total = []

        # for each cam
        cams = self.scene.get_cams()
        for i, cam in enumerate(cams):

            # if i == 0 or i == len(cams) - 1:
            #     continue
            #
            # for each distance map
            dist_maps = self.dist_maps
            for frame, distance_map in enumerate(dist_maps[i]):

                # if frame == 0 or frame == len(dist_maps[i]) - 1:
                #     w = 1
                # else:
                #     w = 5
                #
                # if frame == 0 or frame == len(dist_maps[i]) - 1:
                #     # if frame == len(dist_maps[i]) - 1:
                #     # if frame == 0:
                #     continue

                torch.cuda.empty_cache()

                # get pixels  of edges
                sobel_synt = self.renderer.get_sobel_synth(cam, self.objects[frame])

                # get pixels with edges
                mask = sobel_synt.gray() > self.cfg.threshold_edge_synt
                # dilate mask
                mask = (
                    F.conv2d(
                        mask.unsqueeze(0).unsqueeze(0).float(),
                        torch.ones((1, 1, 3, 3), device=mask.device),
                        padding=1,
                    )
                ).squeeze(0).squeeze(0) > 0

                pixels = torch.nonzero(mask)

                # loss img pixeled
                loss_img = (
                    sobel_synt.img[pixels[:, 0], pixels[:, 1]]
                    * distance_map.img[pixels[:, 0], pixels[:, 1]]
                )

                # # loss img simple
                # loss_img = sobel_synt.img * distance_map.img

                # distance_map.show(wk=1, img_name="distance_map")
                # sobel_synt.show(wk=1)

                # # loss
                # # reg_loss = torch.tensor([0.0])
                # # for i in range(len(parameters)):
                # #     reg_loss += torch.abs(parameters[i] - parameters_old[i]).sum()
                # loss_img = sobel_synt.img * distance_map.img
                # # loss = loss_img.mean() + self.cfg.opt.reg_lambda * reg_loss

                # l2 loss
                loss = torch.mean(torch.pow(loss_img, eval(self.cfg.opt.pow)))
                with torch.no_grad():
                    n = pixels.shape[0] / 200000
                loss = loss / n

                # # l1 loss
                # loss = loss_img.mean()

                loss.backward(retain_graph=False)
                # print("SCALE", self.objects[frame].pose.scale)
                loss_total.append(loss.item())

                if self.cfg.debug_edges:
                    img_edg_syn = torch.zeros(sobel_synt.img.shape)
                    img_edg_syn[pixels[:, 0], pixels[:, 1]] = 1
                    img_edg_syn = Image(
                        img_edg_syn, device=self.images[i][frame].img.device
                    )
                    distmap_show = distance_map.clone()
                    distmap_show.img /= distmap_show.img.max()
                    distmap_show.img[distmap_show.img == 0] = 1
                    distmap_show.show(wk=1, img_name="distance_map")
                    Image.merge_images(
                        img_edg_syn, self.images[i][frame], weight=0.25
                    ).show(wk=wk)
                    # ).show(wk=int(it != 0))
        return np.mean(loss_total)

    def calib_pose_estim_step(self, it):
        return self.ec.calib_step(
            self.scene, debug=self.cfg.debug_boards, coeff=self.cfg.opt.reg_lambda
        )

    def get_parameters(self):

        parameters = []
        masks = []

        if self.cfg.opt_cams:
            for cam in self.scene.get_cams():
                parameters.append(
                    {"params": cam.pose.euler.e, "lr": self.cfg.opt.lr_eul_cam}
                )
                parameters.append(
                    {"params": cam.pose.position, "lr": self.cfg.opt.lr_pos_cam}
                )
                masks.append(torch.ones(3, device=cam.pose.euler.e.device))
                masks.append(torch.ones(3, device=cam.pose.position.device))

        if self.cfg.obj_shared_rot:
            for obj in self.objects:
                obj.pose.euler.e = self.objects[0].pose.euler.e
            parameters.append(
                {
                    "params": self.objects[0].pose.euler.e,
                    "lr": self.cfg.opt.lr_eul_obj,
                }
            )
            masks.append(torch.ones(3, device=self.objects[0].pose.euler.e.device))
            if self.cfg.obj_fixed_ele2:
                masks[-1][:2] = 0

        else:
            for obj in self.objects:
                parameters.append(
                    {
                        "params": obj.pose.euler.e,
                        "lr": self.cfg.opt.lr_eul_obj,
                    }
                )
                masks.append(torch.ones(3, device=obj.pose.euler.e.device))
                if self.cfg.obj_fixed_ele2:
                    masks[-1][:2] = 0

        for obj in self.objects:
            parameters.append(
                {"params": obj.pose.position, "lr": self.cfg.opt.lr_pos_obj}
            )
            masks.append(torch.ones(3, device=self.objects[0].pose.position.device))

        if self.cfg.obj_scale:
            for obj in self.objects:
                obj.pose.scale = self.objects[0].pose.scale
            parameters.append(
                {"params": self.objects[0].pose.scale, "lr": self.cfg.opt.lr_scl_obj}
            )
            masks.append(torch.ones(1, device=self.objects[0].pose.scale.device))

            # if self.cfg.obj_fixed_angles:
            #     parameters.append(
            #         {
            #             "params": self.objects[0].pose.euler.e[2],
            #             "lr": self.cfg.opt.lr_eul_obj,
            #         }
            #     )
            # else:
        #
        # else:
        #     for obj in self.objects:
        #         if self.cfg.obj_fixed_angles:
        #             parameters.append(
        #                 {"params": obj.pose.euler.e[2], "lr": self.cfg.opt.lr_eul_obj}
        #             )
        #         else:
        #             parameters.append(
        #                 {"params": obj.pose.euler.e, "lr": self.cfg.opt.lr_eul_obj}
        #             )
        #
        # if self.cfg.obj_shared_yz:
        #     for obj in self.objects:
        #         obj.pose.position[1:3] = self.objects[0].pose.position[1:3]
        #         parameters.append(
        #             {"params": obj.pose.position[0], "lr": self.cfg.opt.lr_pos_obj}
        #         )
        #         masks.append(torch.ones(1, device=self.objects[0].pose.position.device))
        # parameters.append(
        #     {
        #         "params": self.objects[0].pose.position[1:3],
        #         "lr": self.cfg.opt.lr_pos_obj,
        #     }
        # )
        # masks.append(torch.ones(2, device=self.objects[0].pose.position.device))

        if self.cfg.opt_boards and self.cfg.with_boards:
            for i, board in enumerate(self.scene.boards):
                if i != 0:
                    parameters.append(
                        {"params": board.pose.euler.e, "lr": self.cfg.opt.lr_eul_brd}
                    )
                    masks.append(torch.ones(3, device=board.pose.euler.e.device))
                else:
                    parameters.append(
                        {"params": board.pose.euler.e, "lr": self.cfg.opt.lr_eul_brd}
                    )
                    masks.append(
                        torch.tensor([0, 0, 1], device=board.pose.euler.e.device)
                    )
                parameters.append(
                    {"params": board.pose.position, "lr": self.cfg.opt.lr_pos_brd}
                )
                masks.append(torch.ones(3, device=board.pose.position.device))

        # for obj in self.objects:
        #     parameters.append(
        #         {"params": obj.pose.position, "lr": self.cfg.opt.lr_pos_obj}
        #     )
        #     masks.append(torch.ones(3, device=obj.pose.position.device))
        #     if self.cfg.obj_only_x:
        #         masks[-1][1:] = 0
        #
        for p in parameters:
            p["params"].requires_grad = True

        return parameters, masks

    def run(self):

        self._set_device(self.cfg.opt.device)

        parameters, masks = self.get_parameters()

        # get optimizer and scheduler
        opt = torch.optim.Adam(parameters)
        # opt = torch.optim.SGD(parameters, lr=self.cfg.opt.lr, momentum=0.9)
        # opt = torch.optim.SGD(parameters)
        sch = torch.optim.lr_scheduler.CosineAnnealingLR(
            T_max=self.cfg.opt.iterations, optimizer=opt
        )

        progress_bar = tqdm(
            range(self.cfg.opt.iterations), desc="Optimization for pose estimation"
        )

        for it in progress_bar:

            loss_total = {}
            loss_total["edged"] = self.edged_pose_estim_step(
                it=it, wk=self.cfg.wk_edges
            )

            if self.cfg.with_boards:
                loss_total["boards"] = self.calib_pose_estim_step(it)

            loss_total["total"] = sum(loss_total.values())

            # print(loss_total)
            # loss_total.update({"lr": sch.get_last_lr()})
            # progress_bar.set_postfix(loss_total)
            progress_bar.set_postfix(loss_total)

            # print("LOSSS" + str(loss_total))
            # debug gradients
            # print("Gradients")
            # for p in parameters:
            #     print(p.grad)
            #

            # mask
            for i in range(len(parameters)):
                parameters[i]["params"][0].grad *= masks[i]

            opt.step()
            opt.zero_grad()
            # sch.step()
            # for p in parameters:
            #     print(p.grad)

        # clear_cuda_tensors()
        # self.edged_pose_estim_step(it=self.cfg.opt.iterations, wk=0)

        with torch.no_grad():
            self.saver.save_cameras(self.scene.get_cams())
            self.saver.overwrite_cameras(self.scene.get_cams())
            self.saver.save_object_poses(self.objects)
            self.saver.overwrite_object_poses(self.objects)
            self.saver.save_board_poses(self.scene.boards)
            self.saver.overwrite_board_poses(self.scene.boards)
            self.saver.update_blender(self.cfg)
            self.saver.save_camera_images(
                self.renderer, self.scene.get_cams(), self.objects, self.images
            )

    def realing(self):
        r = Realigner(self.cfg)
        r.save_object_poses(self.objects)
        r.save_cameras(self.scene.get_cams())
        self.saver.update_blender(self.cfg)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--config_path", default=config_default)
    opt = parser.parse_args()
    p = Program(opt)
    p.run()
    # p.realing()
