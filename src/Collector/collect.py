import os, sys
import argparse
import numpy as np
import torch
import time
import shutil
from omegaconf import OmegaConf
from utils_ema.config_utils import load_yaml
from utils_ema.basler_utils import frame_extractor
from utils_ema.image import Image
from utils_ema.blender_utils import get_blend_file, launch_blender_script
from utils_ema.general import load_function_from_path
from utils_ema.light_control import LightController
import cv2

script_dir = os.path.abspath(os.path.dirname(__file__))
cfg_path = os.path.join(script_dir, "..", "..", "configs", "collector.yaml")
led_cfg_path = os.path.join(script_dir, "..", "..", "configs", "leds.yaml")


class Collector:

    def __init__(self, cfg_path, led_cfg_path):
        self.cfg_path = cfg_path
        self.cfg = load_yaml(cfg_path)
        self.fe = frame_extractor(sRGB=True)

        f = load_function_from_path(
            os.path.join(self.cfg.paths.pose_estimator_data_dir, "data_loader.py"),
            "get_data_loader",
        )
        self.pe = f()

        f = load_function_from_path(
            os.path.join(self.cfg.paths.calib_data_dir, "data_loader.py"),
            "get_data_loader",
        )
        dl = f()

        self.led_cfg = load_yaml(led_cfg_path)
        self.lc = LightController(self.led_cfg.ip_controller, self.led_cfg.protocol)

        self.scene = dl.get_scene()
        self.cams = self.scene.get_cams()
        self.lights = self.scene.get_lights()
        if len(self.cams) != self.fe.n_devices:
            raise ValueError(
                "different number of devices wrt number of cameras in scene!"
            )

    def prepare_normalization_data(self):
        self.cc_gain = torch.ones((self.fe.n_devices, 3))
        if self.cfg.normalization.color_correction:
            d = load_yaml(
                os.path.join(self.cfg.paths.color_correction_data_dir, "res.yaml")
            )
            for i, (k, v) in enumerate(d.items()):
                self.cc_gain[i, :] = torch.tensor(v, dtype=torch.float64)

        self.exp_gain = torch.ones(self.fe.n_devices)
        if self.cfg.normalization.exposure_time_ref is not None:
            ets = self.fe.get_exposure()
            self.exp_gain = self.cfg.normalization.exposure_time_ref / torch.tensor(
                ets, dtype=torch.float64
            )

    def preprocess(self, images):

        # undistort images
        images_undist = [
            self.cams[i].intr.undistort_image(images[i]) for i in range(len(images))
        ]

        # normalize image colors
        for i, image in enumerate(images_undist):
            image.img *= self.cc_gain[i, :]  # color correction normalization
            image.img *= self.exp_gain[i]  # exposure normalization
            image.img = np.clip(image.img, 0, 0.999)

        return images_undist

    def test_leds(self):
        for i in range(self.led_cfg.test.n):
            for k, v in self.led_cfg.leds.items():
                self.lc.led_on(
                    channel=v.channel, amp=self.led_cfg.test.intensity, only=True
                )
                time.sleep(self.led_cfg.test.time)
                self.lc.led_off(channel=v.channel)

    def show_references(self):
        self.fe.start_cams()
        self.prepare_normalization_data()
        idx = 0
        while True:
            while True:
                images = self.fe.grab_multiple_cams()
                # images_undist = [ self.cams[i].intr.undistort_image(images[i]) for i in range(len(images)) ]
                images_undist = self.preprocess(images)
                images_overlap = self.pe.overlap_pose_from_idx(images_undist, idx)
                Image.show_multiple_images(images_overlap, wk=1, name="cam_copy")
                key = Image.show_multiple_images(images_overlap, wk=1, name="cam")
                if key == ord("q"):
                    return True
                if key == ord("l"):
                    idx += 1
                if key == ord("k"):
                    idx += 10
                if key == ord("j"):
                    idx -= 10
                if key == ord("h"):
                    idx -= 1
                if key == ord("o"):
                    idx += 100
                if key == ord("u"):
                    idx -= 100
                idx = min(idx, self.pe.n_poses - 1)
                idx = max(idx, 0)

    # def show_references( self ):
    #     self.fe.start_cams()
    #     while True:
    #         images = self.fe.grab_multiple_cams()
    #         images_undist = [ self.cams[i].intr.undistort_image(images[i]) for i in range(len(images)) ]
    #         images_ref = self.pe.get_references()
    #         images_overlap = [ Image.merge_images(images_undist[i],images_ref[i],weight=0.75) for i in range(len(images))]
    #         key = Image.show_multiple_images(images_overlap, wk=1)
    #         if key==ord('q'):
    #             break

    def save_blender(self):
        # save blender scene
        shutil.rmtree(self.cfg.paths.save_scene_dir, ignore_errors=True)
        os.makedirs(os.path.join(self.cfg.paths.save_scene_dir, "mitsuba_scene"))

        shutil.rmtree(os.path.join(self.cfg.paths.save_dir, "mesh"), ignore_errors=True)
        shutil.copytree(
            os.path.join(self.cfg.paths.pose_estimator_data_dir, "mesh"),
            os.path.join(self.cfg.paths.save_dir, "mesh"),
        )

        shutil.copytree(
            self.cfg.paths.blender_dir,
            self.cfg.paths.save_scene_dir,
            dirs_exist_ok=True,
        )
        blend_file = get_blend_file(self.cfg.paths.save_scene_dir)
        launch_blender_script(
            blend_file,
            os.path.join(script_dir, "save_blender.py"),
            arguments=[self.cfg.paths.save_dir],
        )
        # launch_blender_script(blend_file, os.path.join(script_dir,"save_blender.py"), arguments=[os.path.join(self.cfg.paths.pose_estimator_data_dir,"config.yaml")])

    # def capture_frames_with_led( self, led ):
    #     exp_time = self.fe.get_exposure()
    #     self.lc.led_on(led, 1)
    #     time.sleep(0.01)
    #     images = self.fe.grab_multiple_cams()
    #     time.sleep(max(exp_time)*1e-6)
    #     self.lc.led_off(led)
    #     return images

    def save_images(self, image_list, image_show_list):
        # SAVE
        # save data
        out_dir = self.cfg.paths.captured_dir
        shutil.rmtree(out_dir, ignore_errors=True)
        os.makedirs(out_dir)

        if image_list == []:
            return False

        for j in range(len(image_list[0])):
            o_dir = os.path.join(out_dir, "sequences", "Cam_" + str(j).zfill(3))
            o_dir_show = os.path.join(
                out_dir, "sequences_show", "Cam_" + str(j).zfill(3)
            )
            os.makedirs(o_dir)
            os.makedirs(o_dir_show)
            for i in range(len(image_list)):
                image_list[i][j].type(torch.uint8)
                image_list[i][j].save(os.path.join(o_dir, str(i).zfill(3) + ".png"))
                if image_show_list is not None:
                    image_show_list[i][j].save(
                        os.path.join(o_dir_show, str(i).zfill(3) + ".png")
                    )

        return True

    # def sequence_grab( self, images_undist, imgs_show, pose_list, image_list, image_show_list, led_list, pose, sequence, rang ):
    #     key = Image.show_multiple_images(imgs_show, wk=1)
    #     if key==ord('q'):
    #         return False
    #     else:
    #         x = pose.location()[0]
    #         x_ref = sequence[0][1]

    #         if x>=x_ref:
    #             light_id = sequence[0][0]
    #             sequence.pop(0)
    #             images = self.capture_frames_with_led( light_id)
    #             images_undist = [ self.cams[i].intr.undistort_image(images[i]) for i in range(len(images)) ]
    #             imgs_show, pose, _, _ = self.pe.overlap_estimated_pose(images_undist, rang=rang)
    #             pose_list.append(pose)
    #             image_list.append(images_undist)
    #             image_show_list.append(imgs_show)

    #             led_list.append([])
    #             for l_id in range(len(self.lights)):
    #                 intensity = (l_id==light_id)*self.lc.ampere_default
    #                 led_list[-1].append({"light_id":l_id, "intensity":intensity, "name":self.lights[l_id].name})

    #             # led_list.append({"light_id":light_id, "intensity":self.lc.ampere_default})
    #             print(f"collected {len(image_list)} images, led channel: {self.lights[light_id].channel}, x: {x}, x_ref: {x_ref}")

    #             if len(sequence)==0:
    #                 return False

    #         return True
    #

    def _save_cfg(self):
        cfg_path_out = os.path.join(self.cfg.paths.save_dir, "config.yaml")
        OmegaConf.save(self.cfg, cfg_path_out)

    def save_data(self, pose_list, led_list, save_blender=True):
        # SAVE
        if pose_list == []:
            return False

        # save data
        out_dir = self.cfg.paths.captured_dir
        np.save(os.path.join(out_dir, "leds.npy"), led_list)
        for i, pose in enumerate(pose_list):
            pose_list[i] = pose_list[i].get_T()
        np.save(os.path.join(out_dir, "poses.npy"), pose_list)

        # # save blender
        if save_blender:
            self.save_blender()

        # save cfg
        self._save_cfg()

        return True

    # def save_data(self, pose_list, image_list, led_list, image_show_list):
    #     # SAVE
    #     # save data
    #     out_dir = self.cfg.paths.captured_dir
    #     shutil.rmtree( out_dir, ignore_errors=True )
    #     os.makedirs( out_dir )
    #     for i in range(len(image_list)):
    #         o_dir = os.path.join(out_dir,"frame_"+str(i).zfill(3))
    #         o_dir_und = os.path.join(o_dir,"undist")
    #         o_dir_seq = os.path.join(out_dir,"sequences")
    #         os.makedirs(o_dir)
    #         os.makedirs(o_dir_und)
    #         os.makedirs(o_dir_ovl)
    #         for j in range(len(image_list[i])):
    #             image_list[i][j].save( os.path.join(o_dir_und,"Cam_"+str(j).zfill(3))+".png" )
    #             image_list[i][j].save( os.path.join(o_dir_und,"Cam_"+str(j).zfill(3))+".png" )
    #             image_show_list[i][j].save( os.path.join(o_dir_ovl,"Cam_"+str(j).zfill(3))+".png" )
    #             np.save(os.path.join(o_dir,"pose.npy"), pose_list[i].get_T())
    #             np.save(os.path.join(o_dir,"led.npy"), led_list[i])
    #     # save blender
    #     self.save_blender()

    def sequence_grab(
        self,
        images_undist,
        imgs_show,
        pose_list,
        image_list,
        image_show_list,
        led_list,
        pose,
        sequence,
        rang,
    ):
        key = Image.show_multiple_images(imgs_show, wk=1)
        if key == ord("q"):
            return False
        else:
            x = pose.location()[0]
            x_ref = sequence[0][1]

            if x >= x_ref:
                light_id = sequence[0][0]
                sequence.pop(0)
                images = self.fe.grab_multiple_cams()
                if sequence:
                    self.lc.led_on(sequence[0][0], self.cfg.led_amp)

                # images_undist = [ self.cams[i].intr.undistort_image(images[i]) for i in range(len(images)) ]
                images_undist = self.preprocess(images)
                imgs_show, pose, _, _ = self.pe.overlap_estimated_pose(
                    images_undist, rang=rang
                )
                pose_list.append(pose)
                image_list.append(images_undist)
                image_show_list.append(imgs_show)
                led_list.append([])

                # key = Image.show_multiple_images(imgs_show, wk=1) # FOR DEBUG
                self.lc.led_off(light_id)

                if self.lights is not None:
                    for l_id in range(len(self.lights)):
                        intensity = (l_id == light_id) * self.lc.ampere_default
                        led_list[-1].append(
                            {
                                "light_id": l_id,
                                "intensity": intensity,
                                "name": self.lights[l_id].name,
                            }
                        )
                        print(
                            f"collected {len(image_list)} images, led channel: {self.lights[light_id].channel}, x: {x}, x_ref: {x_ref}"
                        )

                # led_list.append({"light_id":light_id, "intensity":self.lc.ampere_default})
                else:
                    print(f"collected {len(image_list)} images")

                if len(sequence) == 0:
                    return False

            return True

    def manual_grab(
        self,
        images_undist,
        imgs_show,
        pose_list,
        image_list,
        image_show_list,
        led_list,
        pose,
        rang=None,
        leds=True,
    ):
        key = Image.show_multiple_images(imgs_show, wk=1)
        if key == ord("q"):
            return False
        if key == 32:
            image_list.append(images_undist)
            image_show_list.append(imgs_show)
            print(f"collected {len(image_list)} images")
            pose_list.append(pose)
            # led_list.append({"light_id":-1, "intensity":-1, "name":self.lights[]})
        if leds and key in [
            ord("0"),
            ord("1"),
            ord("2"),
            ord("3"),
            ord("4"),
            ord("5"),
            ord("6"),
            ord("7"),
            ord("8"),
            ord("9"),
        ]:
            light_id = key - 48
            # images = self.capture_frames_with_led( light_id)
            images = self.fe.grab_multiple_cams()
            # images_undist = [ self.cams[i].intr.undistort_image(images[i]) for i in range(len(images)) ]
            images_undist = self.preprocess(images)
            imgs_show, pose, _, _ = self.pe.overlap_estimated_pose(
                images_undist, rang=rang
            )
            pose_list.append(pose)
            image_list.append(images_undist)
            image_show_list.append(imgs_show)
            # led_list.append({"light_id":light_id, "intensity":self.lc.ampere_default})
            print(
                f"collected {len(image_list)} images, led channel: {self.lights[light_id].channel}"
            )
        return True

    def collect_manual(self):
        # collect
        self.fe.start_cams(signal_period=self.cfg.collect_manual.signal_period)
        self.prepare_normalization_data()
        image_list = []
        image_show_list = []
        pose_list = []
        led_list = []
        while True:
            images = self.fe.grab_multiple_cams()
            # images_undist = [ self.cams[i].intr.undistort_image(images[i]) for i in range(len(images)) ]
            images_undist = self.preprocess(images)
            imgs_show, pose, _, _ = self.pe.overlap_estimated_pose(images_undist)

            f = self.manual_grab(
                images_undist,
                imgs_show,
                pose_list,
                image_list,
                image_show_list,
                led_list,
                pose,
            )
            if not f:
                break

        for led in self.led_cfg.leds.values():
            self.lc.led_off(led.channel)

        self.save_data(pose_list, image_list, led_list, image_show_list)

    def collect_images_only(self):
        # collect
        self.fe.start_cams(
            signal_period=self.cfg.collect_track.signal_period,
            exposure_time=self.cfg.collect_track.exposure_time,
        )
        self.prepare_normalization_data()
        image_list = []
        while True:
            images = self.fe.grab_multiple_cams()
            images_undist = self.preprocess(images)

            key = Image.show_multiple_images(images_undist, wk=1)
            if key == ord("q"):
                cv2.destroyAllWindows()
                break
            if key == 32:
                image_list.append(images_undist)
                print(f"collected {len(image_list)} images")

        for led in self.led_cfg.leds.values():
            self.lc.led_off(led.channel)

        self.save_images(image_list, None)
        self._save_cfg()

        return True

    def collect_while_tracking(self, manual=True, debug=False, save_blender=True):
        # collect
        self.fe.start_cams(
            signal_period=self.cfg.collect_track.signal_period,
            exposure_time=self.cfg.collect_track.exposure_time,
        )
        self.prepare_normalization_data()
        image_list = []
        image_show_list = []
        pose_list = []
        led_list = []
        sequence = None

        current_id = 0

        w = self.cfg.collect_track.range_half
        while True:
            images = self.fe.grab_multiple_cams()
            # images_undist = [ self.cams[i].intr.undistort_image(images[i]) for i in range(len(images)) ]
            images_undist = self.preprocess(images)
            rang = [max(0, current_id - w), min(current_id + w, self.pe.n_poses - 1)]
            imgs_show, pose, in_thresh, best_pose_id = self.pe.overlap_estimated_pose(
                images_undist, rang=rang, debug=debug
            )

            if in_thresh:
                current_id = best_pose_id

            if manual:
                f = self.manual_grab(
                    images_undist,
                    imgs_show,
                    pose_list,
                    image_list,
                    image_show_list,
                    led_list,
                    pose,
                    rang,
                )
                if not f:
                    cv2.destroyAllWindows()
                    break
            else:
                if sequence is None:
                    sequence = self.cfg.collect_sequence.sequence
                if sequence is None:
                    raise ValueError("sequence in config file is empty")
                self.lc.led_on(sequence[0][0], self.cfg.led_amp)
                f = self.sequence_grab(
                    images_undist,
                    imgs_show,
                    pose_list,
                    image_list,
                    image_show_list,
                    led_list,
                    pose,
                    sequence,
                    rang,
                )
                if not f:
                    cv2.destroyAllWindows()
                    break

        for led in self.led_cfg.leds.values():
            self.lc.led_off(led.channel)

        # save data loader

        self.save_images(image_list, image_show_list)
        self.save_data(pose_list, led_list, save_blender)

        return True

    # def collect_planned_sequence( self):
    #     sequence = self.cfg.collect_sequence.sequence
    #     print(sequence)
    #     pass


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--config_path", default=cfg_path)
    parser.add_argument("--led_config_path", default=led_cfg_path)
    opt = parser.parse_args()

    collector = Collector(opt.config_path, opt.led_config_path)
    # collector.show_references()
    # collector.collect_manual()
    collector.test_leds()
    collector.collect_while_tracking(manual=False)
    # collector.collect_while_tracking(manual=True)
