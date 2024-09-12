import os
import cv2
import numpy as np
import torch
from utils_ema.geometry_pose import Pose
from saver import Saver


class Realigner:

    def __init__(self, cfg) -> None:
        self.cfg = cfg
        print("Loading object poses")

        self.obj_poses = np.load(os.path.join(self.cfg.paths.data_out_dir, "poses.npy"))
        self.saver = Saver(self.cfg)
        self._get_transformation()

    @staticmethod
    def _normalize(v):
        return v / torch.norm(v)

    def _get_transformation(self):
        assert len(self.obj_poses) == 2

        # get target axis
        target_vector = torch.from_numpy(
            self.obj_poses[1][:3, 3] - self.obj_poses[0][:3, 3]
        )
        # normalize
        target_vector = self._normalize(target_vector)

        # Step 1: Rotation around Z-axis (Rz)
        # Project target vector onto the xy-plane (ignore z-component)
        target_proj_xy = target_vector.clone()
        target_proj_xy[2] = 0  # Set z-component to 0
        target_proj_xy = self._normalize(target_proj_xy)

        # Compute the angle to rotate around the z-axis (atan2 gives us the signed angle)
        angle_z = torch.atan2(target_proj_xy[1], target_proj_xy[0])
        print("Angle Z: ", angle_z)

        # Rotation matrix for Rz (rotation around z-axis by angle_z)
        Rz = torch.tensor(
            [
                [torch.cos(angle_z), -torch.sin(angle_z), 0],
                [torch.sin(angle_z), torch.cos(angle_z), 0],
                [0, 0, 1],
            ]
        )

        # Step 2: Apply the Z rotation to the target vector to get it in the xy-plane
        rotated_vector = torch.matmul(Rz, target_vector)

        # Step 3: Rotation around Y-axis (Ry)
        # Now rotate around the y-axis to align with the target vector
        angle_y = torch.atan2(rotated_vector[2], rotated_vector[0])
        print("Angle y: ", angle_y)

        # Rotation matrix for Ry (rotation around y-axis by angle_y)
        Ry = torch.tensor(
            [
                [torch.cos(angle_y), 0, torch.sin(angle_y)],
                [0, 1, 0],
                [-torch.sin(angle_y), 0, torch.cos(angle_y)],
            ]
        )

        # Step 4: Combine the rotations Rz and Ry
        # The total rotation matrix is Ry * Rz
        Wold_R_Wnew = torch.matmul(Ry, Rz)
        Wold_T_Wnew = torch.eye(4, dtype=torch.float32)
        Wold_T_Wnew[:3, :3] = Wold_R_Wnew
        self.Wold_T_Wnew = Pose(T=Wold_T_Wnew)

    def save_object_poses(self, objects):

        with torch.no_grad():
            out_dirs = []
            out_dirs.append(
                os.path.join(self.cfg.paths.collector_in_dir, "captured", "poses.npy")
            )
            out_dirs.append(os.path.join(self.cfg.paths.data_out_dir, "poses.npy"))

            pose_list = []
            for i, obj in enumerate(objects):
                pose = self.Wold_T_Wnew * obj.pose
                pose_list.append(pose.get_T())
            for out_dir in out_dirs:
                print("Saving object poses in " + out_dir)
                np.save(out_dir, pose_list)

    def save_cameras(self, cameras):

        with torch.no_grad():
            out_dirs = []
            out_dirs.append(os.path.join(self.cfg.paths.calib_res_dir, "cam_poses.yml"))
            out_dirs.append(os.path.join(self.cfg.paths.data_out_dir, "cam_poses.yml"))

            poses = []
            for i, cam in enumerate(cameras):
                pose = self.Wold_T_Wnew * cam.pose
                poses.append(cam.pose)

            for out_dir in out_dirs:
                print("Saving camera poses" + out_dir)
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
