from trainer import Dataset
import cv2
from utils_ema.texture import Texture
from utils_ema.image import Image
from pathlib import Path
import torch
import argparse
from utils_ema.config_utils import load_yaml
from utils_ema.general import load_class_from_path
from data_collector import DataCollector


class Evaluator:

    def __init__(self, cfg):
        self.cfg = cfg
        self.dc = DataCollector(self.cfg)
        self.device = torch.device(self.cfg.eval.device)

    def evaluate_nerf(self):
        # get distmap
        # save
        # show
        pass

    @staticmethod
    # def gaussian_weights(tensor, mean=0.4, std=0.7):
    def gaussian_weights(tensor, mean=1.0, std=2.0):
        # def gaussian_weights(tensor, mean=None, std=None):
        # Compute the mean and standard deviation of the tensor
        if mean is None:
            mean = torch.mean(tensor)
        if std is None:
            std = torch.std(tensor)

        # Create weights using a Gaussian-like distribution around the mean
        weights = torch.exp(-0.5 * ((tensor - mean) / std) ** 2)
        weights = weights / weights.max()
        # weights = torch.pow(weights, 4)
        # print(weights.max())
        # print(weights.min())
        # Image(weights).show()

        return weights

    @staticmethod
    def _filter_custom(image):

        kernel = torch.tensor(
            [
                [1, 1, 1, 1, 1],
                [1, -1.78, -1.78, -1.78, 1],
                [1, -1.78, -1.78, -1.78, 1],
                [1, -1.78, -1.78, -1.78, 1],
                [1, 1, 1, 1, 1],
            ]
        ).float()

        image_filt = image.filter_custom(kernel)
        image_filt = image_filt.clamp(min=0)
        image_filt = image_filt.mean(dim=-1).unsqueeze(-1)
        # image_filt -= image_filt.min()
        image_filt /= image_filt.max()
        return Image(image_filt)

    def evaluate_trivial(self):

        with torch.no_grad():

            weights = []
            losses = []
            cam_id = 0
            CollectorLoader = load_class_from_path(
                Path(self.cfg.paths.collector_dir, "load.py"), "CollectorLoader"
            )
            print(self.cfg.paths.collector_dir)

            cl_train = CollectorLoader(self.cfg.collect.train.collector_cfg)
            cl_eval = CollectorLoader(self.cfg.collect.eval.collector_cfg)
            dl = DataCollector(self.cfg)

            cams, objs_train, _ = dl._get_cams_objs_imgs(self.cfg.collect.train)
            _, objs_eval, _ = dl._get_cams_objs_imgs(self.cfg.collect.eval)
            cam = list(cams.values())[cam_id]
            res_fact = 1
            cam.intr.resize_pixels(res_fact)
            # poses
            poses_train = cl_train.get_poses()
            x_values = [pose[cam_id].location()[0].item() for pose in poses_train]
            poses_eval = cl_eval.get_poses()

            for img_id, pose_eval in enumerate(poses_eval):

                if img_id == len(poses_eval) - 1:
                    break

                x_eval = pose_eval[cam_id]
                # get index of closest x in x_values to x_eval
                closest_x = min(
                    x_values, key=lambda x: abs(x - x_eval.location()[0].item())
                )
                closest_idx = x_values.index(closest_x)

                # get image with closest idx
                img_train = cl_train.get_image(cam_id, closest_idx)
                img_eval = cl_eval.get_image(cam_id, img_id)

                # resize
                img_train.resize(
                    img_train.resolution() * res_fact, interp=cv2.INTER_NEAREST
                )
                img_eval.resize(
                    img_eval.resolution() * res_fact, interp=cv2.INTER_NEAREST
                )

                # for i in range(100):
                #     img_train.show()
                #     img_eval.show()
                #
                uvs_train, vals_train = dl._collect_uvs_and_img_vals(
                    cam, objs_train[cam_id][closest_idx], img_train
                )
                uvs_eval, vals_eval = dl._collect_uvs_and_img_vals(
                    cam, objs_eval[cam_id][img_id], img_eval
                )

                # debug texture
                texture_train = Texture.init_from_uvs(
                    uvs_train, vals_train, self.cfg.collect.texture_res * res_fact
                )
                texture_eval = Texture.init_from_uvs(
                    uvs_eval, vals_eval, self.cfg.collect.texture_res * res_fact
                )

                # fill
                for i in range(7):
                    texture_train = texture_train.fill_black_pixels(5)
                    texture_eval = texture_eval.fill_black_pixels(5)

                # texture_train.show()
                texture_eval.show()
                # texture_train_sobel = texture_train.prewitt()
                # texture_eval_sobel = texture_eval.prewitt()
                # get kernel to find black circles
                texture_train_sobel = self._filter_custom(texture_train)
                texture_eval_sobel = self._filter_custom(texture_eval)
                #
                texture_train_sobel.show()
                texture_train_sobel.img = torch.min(
                    texture_train_sobel.img, texture_eval_sobel.img
                )
                texture_train_sobel.show()

                # get pixels where both texture_train and texture_eval are not 0
                mask_pixels = torch.logical_and(  # noqa
                    texture_train.img != 0, texture_eval.img != 0
                )
                pixels = torch.nonzero(mask_pixels)
                loss = torch.zeros_like(texture_train.img)
                loss[pixels[:, 0], pixels[:, 1]] = torch.pow(
                    torch.abs(
                        texture_train_sobel.img[pixels[:, 0], pixels[:, 1]]
                        - texture_eval_sobel.img[pixels[:, 0], pixels[:, 1]]
                    ),
                    2,
                )
                # loss = torch.pow(loss + 0.01, 0.2)
                # loss = loss / torch.max(loss)
                # kernel = torch.tensor(
                #     [
                #         [1, 1, 1, 1, 1],
                #         [1, -0.89, -0.89, -0.89, 1],
                #         [1, -0.89, -0.89, -0.89, 1],
                #         [1, -0.89, -0.89, -0.89, 1],
                #         [1, 1, 1, 1, 1],
                #     ]
                # ).float()
                # loss = Image(loss).filter_custom(kernel=kernel)
                # loss =Image(loss).sobel_diff(kernel_size=5).img

                # loss = Image(loss).sobel_diff(kernel_size=5).img
                loss = loss / loss.max()
                # loss = loss.clamp(0, 0.002)
                # loss = loss / loss.max()
                # exclude reflections
                W = self.gaussian_weights(texture_train.img)
                W = W * 1.0
                # W1 = (texture_eval_sobel.img).clamp(0, 0.05)
                # W1 = W1 / W1.max()
                # highlight darker pixels
                W2 = (-(texture_eval.img)) + 1
                W2 = torch.pow(W2, 4).clamp(0, 0.4)
                W2 = W2 / W2.max()
                W2 = W2 * 0
                W_TOT = W
                W_TOT = W_TOT / W_TOT.max()

                weights.append(W_TOT)
                # loss = W * loss

                # loss *= 4

                texture_eval.show()
                texture_train.show()
                print("PORCODDIOOOOOOOOOOOO")
                Image(W).show()
                # Image(W1).show()
                # Image(W2).show()
                # exit(1)
                Image(loss).show()
                # Image(W_TOT).show()
                # Image(loss * W_TOT).show()

                losses.append(loss)

                # img = torch.abs(texture_train.img - texture_eval.img)
                # Image(img).show()

            losses = torch.stack(losses, dim=-1)
            weights = torch.stack(weights, dim=-1)
            weighted_mean = torch.sum(losses * weights, dim=-1)
            weighted_mean = weighted_mean / torch.max(weighted_mean)
            # Image(weighted_mean).show()
            # Image(weighted_mean).show()
            #

            Image(weighted_mean).save("/home/emcarus/Desktop/heatmap.png")
            texture_eval.save("/home/emcarus/Desktop/eval.png")
            for i in range(100):
                Image(weighted_mean).show()
                texture_eval.show()
                texture_train.show()

            #     # Image(torch.mean(losses, dim=-1)).show()
            #     Image(weighted_mean).show()
            #     texture_eval.show(img_name="AO")
            #
            # import ipdb
            #
            # ipdb.set_trace()

            # get eval pose

            # get closest pose

            # get image with closest pose
            #
            # loss

            # get distmap
            # save
            # show
            pass


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--config_path")
    parser.add_argument("--mode", default="trivial")
    opt = parser.parse_args()

    cfg = load_yaml(opt.config_path)
    e = Evaluator(cfg)

    if opt.mode == "trivial":
        e.evaluate_trivial()
    else:
        e.evaluate_nerf()
