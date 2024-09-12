from mathutils import Matrix, Vector
from utils_ema.geometry_pose import Pose
import numpy as np
import os
import torch
import sys
import cv2
import shutil
from utils_ema.config_utils import load_yaml

# from utils_ema.plot import *
from utils_ema.camera_cv import *
from utils_ema.blender_utils import *
from omegaconf import OmegaConf
from mathutils import Matrix
import bpy


cfg_path = sys.argv[-1]
cfg = load_yaml(cfg_path)


# obj poses
obj = bpy.data.objects[cfg.obj_name]
poses_obj_path = os.path.join(cfg.paths.data_out_dir, "poses_obj.npy")
poses_obj = np.load(poses_obj_path, allow_pickle=True)
clear_animation_data(obj)
for i, pose in enumerate(poses_obj):
    set_object_pose(obj, pose)
    obj.keyframe_insert(data_path="location", frame=i)
    obj.keyframe_insert(data_path="rotation_euler", frame=i)

# board poses
board = bpy.data.objects["charuco_board"]
poses_board_path = os.path.join(cfg.paths.data_out_dir, "poses_board.npy")
poses_board = np.load(poses_board_path, allow_pickle=True)
clear_animation_data(board)
for i, pose in enumerate(poses_board):
    set_object_pose(board, pose)
    board.keyframe_insert(data_path="location", frame=i)
    board.keyframe_insert(data_path="rotation_euler", frame=i)

# camera poses
cameras = collect_objects_in_collection("estimated_poses")
poses_cam_path = os.path.join(cfg.paths.data_out_dir, "poses_cam.npy")
poses_cam = np.load(poses_cam_path, allow_pickle=True)
for i, camera_object in enumerate(cameras):

    set_object_pose(camera_object, poses_cam[i])
    blender_camera_transform(camera_object)

    name = "cam_" + str(i)
    # set background images
    filepath = os.path.join(
        cfg.paths.collector_in_dir,
        "captured",
        "sequences",
        "Cam_" + str(i).zfill(3),
        "000.png",
    )
    directory = os.path.dirname(filepath)
    # bpy.ops.image.open(filepath=filepath, relative_path=True, show_multiview=False)
    bpy.data.images.load(filepath=filepath)
    img = bpy.data.images["000.png"]
    img.name = name
    img.source = "SEQUENCE"
    bg = camera_object.data.background_images.new()
    bg.image = img
    bg.display_depth = "FRONT"
    b = camera_object.data.background_images[-1]
    img_user = b.image_user
    img_user.frame_start = 0
    img_user.frame_offset = -1
    img_user.frame_duration = len(list(os.listdir(directory)))
    camera_object.data.show_background_images = True

bpy.ops.wm.save_as_mainfile(filepath=bpy.data.filepath)
