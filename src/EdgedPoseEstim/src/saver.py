import os
import cv2
import sys
import numpy as np
import torch
from utils_ema.blender_utils import launch_blender_script, get_blend_file

script_dir = os.path.dirname(os.path.realpath(__file__))


class Saver:

    def __init__(self, cfg) -> None:
        self.cfg = cfg

    def save_object_poses(self, objects):
        print("Saving object poses")

        with torch.no_grad():
            out_dir = os.path.join(self.cfg.paths.data_out_dir, "poses_obj.npy")
            if not os.path.exists(self.cfg.paths.data_out_dir):
                os.makedirs(self.cfg.paths.data_out_dir)
            pose_list = []
            for i, obj in enumerate(objects):
                pose_list.append(obj.pose)
            np.save(out_dir, pose_list)

    def save_board_poses(self, boards):
        print("Saving board poses")

        with torch.no_grad():
            out_dir = os.path.join(self.cfg.paths.data_out_dir, "poses_board.npy")
            if not os.path.exists(self.cfg.paths.data_out_dir):
                os.makedirs(self.cfg.paths.data_out_dir)

            poses = []
            for i, board in enumerate(boards):
                poses.append(board.pose)
            np.save(out_dir, poses)

    def save_cameras(self, cameras):
        print("Saving camera poses")

        with torch.no_grad():
            out_dir = os.path.join(self.cfg.paths.data_out_dir, "poses_cam.npy")
            if not os.path.exists(self.cfg.paths.data_out_dir):
                os.makedirs(self.cfg.paths.data_out_dir)

            poses = []
            for i, cam in enumerate(cameras):
                poses.append(cam.pose)
            np.save(out_dir, poses)

    def overwrite_object_poses(self, objects):
        print("Overwriting object's collected poses")
        out_dir = self.cfg.paths.captured_dir
        pose_list = []
        for i, obj in enumerate(objects):
            pose = obj.pose
            pose_list.append(pose.get_T())
        np.save(os.path.join(out_dir, "poses.npy"), pose_list)

    def overwrite_cameras(self, cameras):
        print("Overwriting camera poses")

        out_dir = os.path.join(
            self.cfg.paths.data_in_dir, "output", "global", "cam_poses.yml"
        )

        poses = []
        for i, cam in enumerate(cameras):
            poses.append(cam.pose)

        fs = cv2.FileStorage(out_dir, cv2.FILE_STORAGE_WRITE)
        fs.write("nb", len(poses))
        for i_cam, pose in enumerate(poses):
            fs.startWriteStruct("cam_" + str(i_cam), cv2.FileNode_MAP)
            fs.write("w_T_cam", pose.get_T().numpy())
            fs.write("cam_T_w", pose.get_T_inverse().numpy())
            fs.endWriteStruct()
            # plotter.plot_pose(pose)
        # plotter.show()
        fs.release()

    def overwrite_board_poses(self, boards):
        pass

    def update_blender(self, cfg):
        blend_file = get_blend_file(self.cfg.paths.calib_scene_dir)
        launch_blender_script(
            blend_file,
            os.path.join(script_dir, "update_blender.py"),
            [self.cfg.config_path],
        )
        pass
