import cv2
import torch
import os
import itertools
from utils_ema.camera_cv import *
from utils_ema.text import read_content, write_content
from utils_ema.geometry_pose import *
from utils_ema.charuco import Charuco
from utils_ema.scene import Scene
from utils_ema.light_point import PointLight
from utils_ema.objects import Object
from utils_ema.config_utils import load_yaml
from utils_ema.plot import plotter
from utils_ema.general import load_class_from_path
from utils_ema.mitsuba_scene import MitsubaScene

from omegaconf import OmegaConf
from pathlib import Path

script_dir = os.path.abspath(os.path.dirname(__file__))
cfg_path = os.path.join(script_dir, "..", "..", "configs", "collector.yaml")


class CollectorLoader:

    def __init__(self, cfg_path):
        self.cfg_path = cfg_path
        self.cfg = load_yaml(cfg_path)

        # paths
        self.frames_out = os.path.join(self.cfg.paths.save_dir, "captured")
        self.mesh_dir = os.path.join(self.cfg.paths.save_dir, "mesh")
        self.sequence_dir = Path(os.path.join(self.frames_out, "sequences"))
        self.sequence_show_dir = Path(os.path.join(self.frames_out, "sequences_show"))
        self.subfolder = ""

    def set_subfolder(self, subfolder):
        self.subfolder = subfolder

    def get_poses(self, asyncr=False):
        if not hasattr(self, "poses"):
            pose_path = os.path.join(
                self.cfg.paths.captured_dir, self.subfolder, "poses.npy"
            )

            if not os.path.exists(pose_path):
                raise ValueError(f"{pose_path} not valid path!")

            poses = np.load(pose_path, allow_pickle=True)

            if asyncr:
                in_thresh = self.get_in_thresh(asyncr=True)
                poses = [
                    p for i, p in enumerate(itertools.chain(*poses)) if in_thresh[i]
                ]
            self.poses = poses

        return self.poses

    def get_lights_data(self, asyncr=False):
        if not hasattr(self, "lights_data"):
            leds_path = os.path.join(
                self.cfg.paths.captured_dir, self.subfolder, "leds.npy"
            )

            if not os.path.exists(leds_path):
                raise ValueError(f"{leds_path} not valid path!")

            lights_mat = np.load(leds_path, allow_pickle=True)

            # pose = Pose(T=torch.from_numpy(l))
            # poses["frame_"+str(i).zfill(3)] = pose

            # for i, ff in enumerate(self.sequence_dir):
            #     light_path = os.path.join(ff,"led.npy")
            #     d = np.load(light_path, allow_pickle=True)
            #     lights_data.append(d)

            if asyncr:
                in_thresh = self.get_in_thresh(asyncr=True)
                lights_data = [
                    l
                    for i, l in enumerate(itertools.chain(*lights_mat))
                    if in_thresh[i]
                ]
            else:
                for i, l in enumerate(lights_mat):
                    lights_data.append(l)
            self.lights_data = lights_data

        return self.lights_data

    def get_in_thresh(self, asyncr=False):
        if not hasattr(self, "in_thresh"):
            inthresh_path = os.path.join(
                self.cfg.paths.captured_dir, self.subfolder, "in_thresh.npy"
            )

            if not os.path.exists(inthresh_path):
                raise ValueError(f"{inthresh_path} not valid path!")

            in_thresh = np.load(inthresh_path, allow_pickle=True)

            if asyncr:
                in_thresh = [i for i in itertools.chain(*in_thresh)]

            self.in_thresh = in_thresh

        return self.in_thresh

    def get_camera_ids_for_frames(self):

        # get cams
        cam_path = os.path.join(self.cfg.paths.captured_dir, self.subfolder, "cams.npy")

        if not os.path.exists(cam_path):
            raise ValueError(f"{cam_path} not valid path!")

        cams = np.load(cam_path, allow_pickle=True)
        cams = [c for c in itertools.chain(*cams)]

        # get in_thresh
        in_thresh = self.get_in_thresh(asyncr=True)

        return [c for i, c in enumerate(cams) if in_thresh[i]]

    # def __get_lights_data(self):
    #     lights = {}
    #     for i, ff in enumerate(self.sequence_dir):
    #         light_path = os.path.join(ff,"led.npy")
    #         d = list(dict(np.load(light_path, allow_pickle=True).item()).values())[0]
    #         light = PointLight( **d )
    #         lights[os.path.basename(ff)] = light
    #     return lights

    # def get_light_intensities(self):
    #     intensities = {}
    #     for i, ff in enumerate(self.sequence_dir):
    #         pose_path = os.path.join(ff, "pose.npy")
    #         pose = Pose(T=torch.from_numpy(np.load(pose_path)))
    #         intensities[os.path.basename(ff)] = pose
    #     return intensities
    #

    def get_images_gen(self, overlap=False, device="cpu", dtype=torch.float32):
        images_dict = {}
        dir = self.sequence_dir if not overlap else self.sequence_show_dir
        for i, image_dir in enumerate(sorted(dir.iterdir())):
            images_dict[image_dir.stem] = {}
            for j, image_file in enumerate(sorted(image_dir.iterdir())):
                image = Image(path=str(image_file), device=device, dtype=dtype)
                yield image

    def get_image(self, cam_idx, frame_idx, overlap=False, device="cpu"):
        dir = self.sequence_dir if not overlap else self.sequence_show_dir
        cam_dirs = sorted(list(dir.iterdir()))
        # get list of files in dir
        images_files = sorted(list(cam_dirs[cam_idx].iterdir()))
        # image_dir = sorted(list(dir.iterdir()))[cam_idx]
        image = Image(path=str(images_files[frame_idx]), device=device)
        return image

    def get_images(self, overlap=False, device="cpu"):
        images_dict = {}
        dir = self.sequence_dir if not overlap else self.sequence_show_dir
        for i, image_dir in enumerate(sorted(dir.iterdir())):
            images_dict[image_dir.stem] = {}
            for j, image_file in enumerate(sorted(image_dir.iterdir())):
                image = Image(path=str(image_file), device=device)
                images_dict[image_dir.stem][image_file.stem] = image
        return images_dict

    # def get_images_overlapped(self):
    #     images_dict = {}
    #     for i, ff in enumerate(self.sequence_dir):
    #         images_dict[os.path.basename(ff)] = {}
    #         image_dir = os.path.join(ff, "overlapped")
    #         image_files = list(os.listdir(image_dir))
    #         image_files.sort()
    #         for j, image_file in enumerate(image_files):
    #             image_path = os.path.join(image_dir, image_file)
    #             image = Image(path=image_path)
    #             images_dict[os.path.basename(ff)]["Cam_" + str(j).zfill(3)] = image
    #     return images_dict
    #
    # def get_mesh(self):
    #     mesh_dir = self.cfg.paths.mesh_dir

    def _get_cams_asyncr(self, scene):
        cams = scene.get_cams()
        in_thresh = self.get_in_thresh(asyncr=True)
        ids = self.get_camera_ids_for_frames()
        k = 0

        if cams is not None:
            new_cams = []
            imgs_path = os.path.join(
                self.cfg.paths.captured_dir, self.subfolder, "sequences"
            )
            for i in range(len(in_thresh)):
                frame = i // len(cams)
                if in_thresh[i]:
                    cam_id = ids[k]
                    cam = cams[cam_id]
                    img_path = os.path.join(
                        imgs_path,
                        "Cam_" + str(cam_id).zfill(3),
                        str(frame).zfill(3) + ".png",
                    )
                    new_cam = cam.clone(
                        same_intr=True, same_pose=True, image_paths={"rgb": img_path}
                    )
                    new_cam.load_images()
                    new_cams.append([new_cam])
                    k += 1
            scene.cams = new_cams
            return new_cams

    def _get_cams(self, scene, poses):
        cams = scene.get_cams()

        if cams is not None:
            new_cams = []
            imgs_path = os.path.join(
                self.cfg.paths.captured_dir, self.subfolder, "sequences"
            )
            for i in range(len(poses)):
                new_cams.append([])
                for j, cam in enumerate(cams):
                    img_path = os.path.join(
                        imgs_path, "Cam_" + str(j).zfill(3), str(i).zfill(3) + ".png"
                    )
                    new_cam = cam.clone(
                        same_intr=True, same_pose=True, image_paths={"rgb": img_path}
                    )
                    new_cam.load_images()
                    new_cams[-1].append(new_cam)
            scene.cams = new_cams
            return new_cams

    def _get_lights(self, scene):
        lights = scene.get_lights()
        lights_data = self.get_lights_data(asyncr=False)
        poses = self.get_poses(asyncr=False)
        lights = scene.get_lights()
        if lights is not None:
            new_lights = []
            for i in range(len(poses)):
                new_lights.append([])
                for j, light in enumerate(lights):
                    new_light = light.clone(same_position=True)
                    if light.name == lights_data[i].name:
                        new_intensity = lights_data[i].intensity
                    else:
                        new_intensity = 0
                    new_light.intensity = new_intensity
                    new_lights[-1].append(new_light)
            scene.lights = new_lights
            return new_lights

    def _get_lights_asyncr(self, scene):
        lights_data = self.get_lights_data(asyncr=True)
        lights = scene.get_lights()
        if lights is not None:
            new_lights = []
            for i, l in enumerate(lights_data):
                new_lights.append([])
                for j, light in enumerate(lights):
                    new_light = light.clone(same_position=True)
                    if light.name == l.name:
                        new_intensity = l.intensity
                    else:
                        new_intensity = 0
                    new_light.intensity = new_intensity
                    new_lights[-1].append(new_light)
            scene.lights = new_lights

            # # debug
            # for i in new_lights:
            #     print([l.intensity for l in i])

            return new_lights

    def get_scene(self, asyncr=False):

        # get original scene
        f = load_function_from_path(
            os.path.join(self.cfg.paths.calib_data_dir, "data_loader.py"),
            "get_data_loader",
        )
        dl = f()
        scene = dl.get_scene()

        # add poses
        poses = self.get_poses(asyncr=asyncr)
        n_poses = len(poses)

        # get cameras
        if asyncr:
            cams = self._get_cams_asyncr(scene)
        else:
            cams = self._get_cams(scene, poses)

        # get lights
        if asyncr:
            lights = self._get_lights_asyncr(scene)
        else:
            lights = self._get_lights(scene)

        # extend lights

        # put and extend objects
        mesh_path = [
            os.path.join(self.mesh_dir, o)
            for o in os.listdir(self.mesh_dir)
            if Path(o).suffix == ".obj"
        ][0]
        objects = []
        for pose in poses:
            objects.append([Object(mesh=mesh_path, pose=pose, device=scene.device)])
        scene.objects = objects

        # mitsuba_scene
        xml_path = os.path.join(self.cfg.paths.save_mitsuba_scene, "scene.xml")

        self.modify_xml(xml_path, cams)
        scene_mitsuba = MitsubaScene(xml_path=xml_path)

        scene.set_mitsuba_scene(self.get_mitsuba_scene())

        return scene

    def modify_xml(self, xml_path, cams):
        content = read_content(xml_path)

        res_list = []
        # for cam in scene.get_cams_in_frame(0):
        for cam in cams:
            res_list.append(tuple(cam[0].intr.resolution.tolist()))

        for res in res_list:
            content = content.replace("$resx", str(res[0]), 1)
        for res in res_list:
            content = content.replace("$resy", str(res[1]), 1)
        write_content(xml_path, content)

    def get_mitsuba_scene(self):
        # scene_mitsuba = self.data_loader.get_mitsuba_scene()
        print(self.cfg.paths)
        xml_path = os.path.join(self.cfg.paths.save_mitsuba_scene, "scene.xml")
        scene_mitsuba = MitsubaScene(xml_path=xml_path)
        return scene_mitsuba


if __name__ == "__main__":
    cl = CollectorLoader(cfg_path)
    s = cl.get_scene()

    # for l in s.get_lights():
    #     for li in l:
    #         print(li.intensity)

    # fd = cl.get_poses()
    # scene = cl.get_scene()
    # print(scene.lights)
