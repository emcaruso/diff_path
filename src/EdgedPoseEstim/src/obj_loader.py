from utils_ema.objects import Object
from utils_ema.geometry_pose import Pose
import torch
import os, sys


class ObjLoader:

    def __init__(self, cfg) -> None:
        self.cfg = cfg
        pass

    #
    # def get_obj(self):
    #     return Object(self.cfg.paths.mesh_path)
    #
    def get_objects(self):
        obj_ref = Object(self.cfg.paths.mesh_path)
        # poses = [Pose(T=torch.eye(4)) for _ in range(n)]
        poses = self.get_poses()
        objects = []
        for pose in poses:
            obj = obj_ref.clone()
            obj.pose = pose
            objects.append(obj)
        return objects

    def get_poses(self):
        sys.path.append(self.cfg.paths.collector_dir)
        from load import CollectorLoader

        data_loader = CollectorLoader(
            os.path.join(self.cfg.paths.collector_in_dir, "config.yaml")
        )
        try:
            poses = data_loader.get_poses()
            return list(poses.values())
        except:
            return [Pose(T=torch.eye(4))]
