import bpy
import sys
from omegaconf import OmegaConf
from utils_ema.blender_utils import *
from utils_ema.config_utils import load_yaml
import numpy as np
from pathlib import Path

path = sys.argv[-1]

# dirs
mesh_dir = os.path.join(path,"mesh")
captured_dir = os.path.join(path, "captured")
mitsuba_dir = os.path.join(os.path.join(path, "scene", "mitsuba_scene"))

# load mesh
obj_names = [ Path(f).stem for f in os.listdir(mesh_dir) if Path(f).suffix==".obj"]
if len(obj_names)!=1: raise ValueError("Multiple meshes in {mesh_dir}")
obj = bpy.data.objects[obj_names[0]]

# load poses and leds
npy_poses = np.load(os.path.join(captured_dir,"poses.npy"), allow_pickle=True)
poses = [ Pose(T=torch.from_numpy(T)) for T in npy_poses ]
leds = np.load(os.path.join(captured_dir,"leds.npy"), allow_pickle=True)

clear_animation_data(obj)
frames_folder = [ os.path.join(captured_dir,d) for d in list(os.listdir(captured_dir)) if os.path.isdir(os.path.join(captured_dir,d))]
frames_folder.sort()
n_frames = len(frames_folder)

# set obj keyframes
obj.keyframe_insert(data_path="location", frame=0)
for i, pose in enumerate(poses):
    set_object_pose(obj, pose)
    obj.keyframe_insert(data_path="location", frame=i+1)

# set light keyframes
# for each light
light_objs = collect_objects_in_collection("point_lights_estimated")
for j, light_obj in enumerate(light_objs):
    light_obj.data.energy = 0
    light_obj.data.keyframe_insert(data_path="energy", frame=0)
    for i, led in enumerate(leds):
        light = led
        light_obj.data.energy = light[j]['intensity']*1000
        light_obj.data.keyframe_insert(data_path="energy", frame=i+1)

# set camera backgrounds
cams = collect_objects_in_collection("estimated_poses")
for i, cam in enumerate(cams):
    # set background images
    cam_name = "Cam_"+str(i).zfill(3)
    filepath = os.path.join( os.path.join(captured_dir,"sequences", cam_name,"000.png" ))
    directory = os.path.dirname(filepath)
    # img = bpy.data.images.load(filepath=filepath)
    # bpy.ops.image.open(filepath=filepath, directory=directory, files=[{"name":"000.png"}], relative_path=True, show_multiview=False)
    bpy.ops.image.open(filepath=filepath, relative_path=True, show_multiview=False)
    img = bpy.data.images["000.png"]
    img.name = cam_name
    img.source = 'SEQUENCE'

    bg = cam.data.background_images.new()
    bg.image = img

    b = cam.data.background_images[-1]
    img_user = b.image_user
    img_user.frame_start = 1
    img_user.frame_offset = -1
    img_user.frame_duration = len(list(os.listdir(directory)))


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




