import bpy
import sys
import itertools
from omegaconf import OmegaConf
from utils_ema.blender_utils import *
from utils_ema.config_utils import load_yaml
import numpy as np
from pathlib import Path

path = sys.argv[-1]

cfg = load_yaml(os.path.join(path, "config.yaml"))
obj_names = cfg.objects

# dirs
mesh_dir = os.path.join(path, "mesh")
captured_dir = os.path.join(path, "captured")
mitsuba_dir = os.path.join(os.path.join(path, "scene", "mitsuba_scene"))


# load poses
npy_poses = np.load(os.path.join(captured_dir, "poses.npy"), allow_pickle=True)
npy_inthresh = np.load(os.path.join(captured_dir, "in_thresh.npy"), allow_pickle=True)
poses = [p for p in npy_poses]
poses = [p for p in itertools.chain(*poses)]
in_thresh = [i for i in npy_inthresh]
in_thresh = [i for i in itertools.chain(*in_thresh)]

# load leds
leds = np.load(os.path.join(captured_dir, "leds.npy"), allow_pickle=True)
leds = [l for l in itertools.chain(*leds)]

# load mesh
# obj_names = [ Path(f).stem for f in os.listdir(mesh_dir) if Path(f).suffix==".obj"]
# if len(obj_names)!=1: raise ValueError("Multiple meshes in {mesh_dir}")
for obj_name in obj_names:
    obj = bpy.data.objects[obj_name]

    clear_animation_data(obj)
    set_object_pose(obj, Pose())

    # set obj keyframes
    obj.keyframe_insert(data_path="location", frame=0)
    k = 0
    for i, pose in enumerate(poses):
        if in_thresh[i]:
            set_object_pose(obj, pose)
            obj.keyframe_insert(data_path="location", frame=k + 1)
            k += 1

# set light keyframes
# for each light
light_objs = collect_objects_in_collection("point_lights_estimated")
for j, light_obj in enumerate(light_objs):
    light_obj.data.energy = 0
    light_obj.data.keyframe_insert(data_path="energy", frame=0)
    k = 0
    for i, led in enumerate(leds):
        if in_thresh[i]:
            if led.name == light_obj.name:
                light_obj.data.energy = led.intensity * 1000
            else:
                light_obj.data.energy = 0
            light_obj.data.keyframe_insert(data_path="energy", frame=k + 1)
            k += 1

# # set camera backgrounds
# cams = collect_objects_in_collection("estimated_poses")
# for i, cam in enumerate(cams):
#     # set background images
#     cam_name = "Cam_" + str(i).zfill(3)
#     filepath = os.path.join(
#         os.path.join(captured_dir, "sequences", cam_name, "000.png")
#     )
#     directory = os.path.dirname(filepath)
#     # img = bpy.data.images.load(filepath=filepath)
#     # bpy.ops.image.open(filepath=filepath, directory=directory, files=[{"name":"000.png"}], relative_path=True, show_multiview=False)
#     bpy.ops.image.open(filepath=filepath, relative_path=True, show_multiview=False)
#     img = bpy.data.images["000.png"]
#     img.name = cam_name
#     img.source = "SEQUENCE"
#
#     bg = cam.data.background_images.new()
#     bg.image = img
#     bg.display_depth = "FRONT"
#     b = cam.data.background_images[-1]
#     img_user = b.image_user
#     img_user.frame_start = 1
#     img_user.frame_offset = -1
#     img_user.frame_duration = len(list(os.listdir(directory)))


set_collection_hide_val("Board", True, ignore_errors=True)


# # Update scene
# bpy.context.scene.frame_start = start_frame
# bpy.context.scene.frame_end = end_frame
# bpy.context.scene.render.fps = 24  # Or your specific frame rate

bpy.context.scene.frame_set(0)

bpy.ops.wm.save_as_mainfile(filepath=bpy.data.filepath)
mitsuba_path = os.path.join(mitsuba_dir, "scene.xml")
bpy.ops.export_scene.mitsuba(filepath=mitsuba_path, use_selection=False)


# print("Exporting mesh")
# bpy.ops.object.select_all(action='DESELECT')
# obj.select_set(True)
# export_path = os.path.join(mesh_path,cfg.render_tables.obj_name+".obj")
# export_path = os.path.join(path, "mesh")
# bpy.ops.wm.obj_export(
#     filepath=export_path,
#     export_selected_objects=True,
#     forward_axis='Y',
#     up_axis='Z',
#     global_scale=1,
#     # global_scale=cfg.render_tables.obj_scale,
