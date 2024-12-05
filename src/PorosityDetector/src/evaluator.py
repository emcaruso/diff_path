from data_collector import DataCollector
import cv2
import torchshow as ts
import numpy as np
from utils_ema.image import Image
from utils_ema.texture import Texture
from utils_ema.mesh import read_mesh, Mesh
from pathlib import Path
import torch
from torch.utils.data import DataLoader
from model import Model
from utils_ema.torch_utils import DiceLoss, set_seed
from tqdm import tqdm
import os
import wandb
from dataset import Dataset
from trainer import Trainer


class Evaluator:

    def __init__(self, cfg):
        self.cfg = cfg
        self.device = torch.device(self.cfg.eval.device)
        set_seed(self.cfg.train.seed)
        self.mask, self.mask_idxs = Trainer.mask_data(
            self.cfg.paths.mask_path,
            self.device,
            self.cfg.train.patch_size,
            self.cfg.train.stride_factor,
            self.cfg.collect.min_patch_ratio,
        )
        self.patches_shape = (
            Image(self.mask)
            .patchify(self.cfg.train.patch_size, self.cfg.train.stride_factor)
            .shape
        )
        self._get_texture_area()

    def _get_texture_area(self):

        mesh = None

        # texture position
        texture_pos_path = Path(self.cfg.paths.mesh_path).parent / "texture_pos.npy"
        if texture_pos_path.exists():
            print("texture pos found at ", texture_pos_path)
            img = np.load(str(texture_pos_path))
            self.pos_tex = Texture.init_from_img(img=img)

        else:
            print("texture pos not found, computing ... ")
            mesh = read_mesh(self.cfg.paths.mesh_path)
            self.pos_tex = mesh.get_texture_3dposition(self.mask.shape[0])
            np.save(str(texture_pos_path), self.pos_tex.img)

        # texture area
        texture_area_path = Path(self.cfg.paths.mesh_path).parent / "texture_area.npy"
        if texture_area_path.exists():
            print("texture area found at ", texture_area_path)
            img = np.load(str(texture_area_path))
            self.area_tex = Texture.init_from_img(img=img)
        else:
            print("texture area not found, computing...")
            if mesh is None:
                mesh = read_mesh(self.cfg.paths.mesh_path)
            mask = (self.pos_tex.sobel().img > 0.001).squeeze()
            self.area_tex = mesh.get_texture_3darea(self.mask.shape[0])
            self.area_tex.img[mask] = 0
            self.area_tex.img *= 1e6  # squared meters to squared mm
            np.save(str(texture_area_path), self.area_tex.img)

    def load_model(self, model_path):
        model = Model(self.cfg)
        model.load_state_dict(torch.load(model_path))
        model.to(self.device)
        return model

    def _get_generator(self, folder):
        for img_path in sorted(folder.iterdir()):
            tex = Image(path=str(img_path))
            yield tex

    def _get_eval_textures_generator(self, idx, eval_dir="eval"):
        out_dir = os.path.join(
            self.cfg.paths.save_data, self.cfg.collect[eval_dir].subfolder
        )
        out_dir_tex = Path(os.path.join(out_dir, "textures"))
        # load textures from out_dir_tex path
        textures = []
        tex_dir = sorted(out_dir_tex.iterdir())[idx]
        tex_paths = sorted(tex_dir.iterdir())
        return Image(path=str(tex_paths[0])), Image(path=str(tex_paths[-1]))
        # tex =
        # yield i, tex

    def _get_eval_textures_generator_all(self, mode):
        out_dir = os.path.join(
            self.cfg.paths.save_data, self.cfg.collect[mode].subfolder
        )
        out_dir_tex = Path(os.path.join(out_dir, "textures"))
        # load textures from out_dir_tex path
        textures = []
        for i, tex_dir in enumerate(sorted(out_dir_tex.iterdir())):
            for tex_path in sorted(tex_dir.iterdir()):
                tex = Image(path=str(tex_path))
                yield i, tex

    def _get_data_loader(self, mode, subfolder, train=False):

        dataset = Dataset(self.cfg, subfolder, train=train)
        data_loader = DataLoader(dataset, **self.cfg[mode].data_loader_params)
        return data_loader

    def _compute_images(self, eval_dir):
        eval_textures_generator_all = self._get_eval_textures_generator_all(eval_dir)
        data_load_train = self._get_data_loader("train", "train", train=True)
        data_load_eval = self._get_data_loader("eval", eval_dir, train=False)
        imgs = []
        texs = []
        for it in data_load_eval.dataset.idxs_all:
            data_load_eval.dataset.idxs = [it]
            eval_tex_0, eval_tex_1 = self._get_eval_textures_generator(
                data_load_eval.dataset.idxs[0], eval_dir=eval_dir
            )

            model_dir = Path(self.cfg.paths.save_data) / "model"
            if self.cfg.eval.model == "ensemble":
                model_paths = [p for p in sorted(model_dir.iterdir())]
            else:
                model_paths = [model_dir / (self.cfg.eval.model + ".pth")]

            if self.cfg.eval.ensemble_n is None and self.cfg.eval.model:
                self.cfg.eval.ensemble_n = len(model_paths)

            # wandb
            if self.cfg.wandb.disabled:
                os.environ["WANDB_DISABLED"] = "true"
                wandb.init(mode="disabled")
            else:
                wandb.init(
                    project=self.cfg.wandb.project + "_eval", config=dict(self.cfg)
                )

            mask = Texture.init_from_path(self.cfg.paths.mask_path).gray().unsqueeze(-1)

            final_pred = torch.zeros(self.patches_shape, device=self.device)
            for i in tqdm(range(self.cfg.eval.ensemble_n), desc="models"):
                # for i, model_path in enumerate(tqdm(model_paths, desc="models")):
                model_path = model_paths[i]

                model = self.load_model(model_path)

                model.eval()
                # if epoch % self.cfg.train.eval_every == 0:
                with torch.no_grad():

                    ids = []
                    y_list = []
                    for x, _, id in tqdm(data_load_eval, leave=False):
                        x = x.to(self.device, non_blocking=True)
                        mask = x > 0
                        x = data_load_train.dataset.norm(x)
                        y_hat = model(x)
                        y_hat *= mask

                        ids.append(id)
                        y_list.append(y_hat)

                    ids = torch.cat(ids).to(self.device)
                    y_list = torch.cat(y_list).to(self.device).permute(0, 2, 3, 1)
                    y_list = (y_list > 0.5).float()

                    if self.cfg.eval.demo:

                        d = torch.nonzero(ids[1:] < ids[:-1]).squeeze() + 1
                        split_indices = torch.cat(
                            [
                                torch.tensor([0], device=d.device),
                                d,
                                torch.tensor([len(ids)], device=d.device),
                            ]
                        )
                        ids_sub = [
                            ids[split_indices[i] : split_indices[i + 1]]
                            for i in range(len(split_indices) - 1)
                        ]
                        y_list_sub = [
                            y_list[split_indices[i] : split_indices[i + 1]]
                            for i in range(len(split_indices) - 1)
                        ]
                        for it_, ids_ in enumerate(tqdm(ids_sub)):
                            patches = torch.zeros(
                                self.patches_shape,
                                device=self.device,
                                dtype=torch.float32,
                            )
                            y_list_ = y_list_sub[it_]
                            patches[ids_] = y_list_
                            img_ = Image.patches_to_image(
                                patches,
                                self.cfg.train.stride_factor,
                                self.mask.shape[0],
                                self.mask.shape[1],
                                max_interp=True,
                                device=patches.device,
                            )
                            img_ *= self.mask

                            tex = eval_textures_generator_all.__next__()[1].to(
                                self.device
                            )
                            img_show = Image.merge_images(img_, tex, 0.5)
                            Image(img_).show()
                            img_show.show()

                    b, W, H, _ = final_pred.shape
                    N = len(ids)
                    final_pred_flat = final_pred.view(b, -1)  # Shape [b, W*H*1]
                    y_list_flat = y_list.view(N, -1)  # Shape [N, W*H*1]
                    final_pred_flat.index_add_(0, ids, y_list_flat)
                    final_pred = final_pred_flat.view(b, W, H, 1)

            # threshold
            img = Image.patches_to_image(
                final_pred,
                self.cfg.train.stride_factor,
                self.mask.shape[0],
                self.mask.shape[1],
                max_interp=True,
                device=final_pred.device,
            )
            img *= self.mask
            img /= self.cfg.eval.ensemble_n
            img = img.float()
            img_precise = img > self.cfg.eval.eval_thresh_precise
            img_raw = img > self.cfg.eval.eval_thresh_raw
            _, _, multi_mask_raw = Image(img_raw).process_clusters()
            _, cen, multi_mask_precise = Image(img_precise).process_clusters()
            multi_mask_raw = multi_mask_raw.to(self.device)
            multi_mask_precise = multi_mask_precise.to(self.device)

            for i in range(multi_mask_precise.shape[-1]):
                idxs = torch.nonzero(multi_mask_precise[..., i] > 0)
                ten = multi_mask_raw[idxs[:, 0], idxs[:, 1], :]
                ch = torch.any(ten != 0, dim=(0))
                multi_mask_precise[..., i] = multi_mask_raw[..., ch].max(dim=-1).values

            img = multi_mask_precise.max(dim=-1).values.float()

            texs.append(Image(eval_tex_0.img + eval_tex_1.img))
            # img_show = Image.merge_images(img.cpu(), tex.img, 0.5)
            imgs.append(Image(img))

        return imgs, texs

        # while True:
        #     img.show(wk=0)
        #     tex.show(wk=0)
        #
        #

    def _get_image_with_infos(self, pred):
        num_clusters, centroids, multi_mask = pred.process_clusters()
        colored_image = Image.get_multimask_with_colormap(multi_mask)

        for i in range(multi_mask.shape[-1]):
            mask = multi_mask[:, :, i]
            color = tuple(
                # (colored_image.img[mask > 0].max(dim=0).values * 255).int().tolist()
                (colored_image.img[mask > 0].max(dim=0).values).tolist()
            )
            pore_area = self.area_tex.img[mask > 0].sum().item()
            pore_area_str = "{:.2f}".format(pore_area)
            position = (int(centroids[i][1]), int(centroids[i][0]) - 10)
            position_apex = (int(centroids[i][1] + 120), int(centroids[i][0]) - 20)
            text = pore_area_str + " mm"
            font_scale = 0.8
            info_img = colored_image.put_text_on_image(
                text=text,
                position=position,
                color=color,
                font_scale=font_scale,
            )
            info_img = colored_image.put_text_on_image(
                text="2",
                position=position_apex,
                color=color,
                font_scale=font_scale * 0.5,
            )

            info = {"num_clusters": num_clusters}
        return info_img, info

    def evaluate(self, eval_dir="eval"):
        preds, texs = self._compute_images(eval_dir=eval_dir)
        for i in range(len(preds)):
            info_img, info = self._get_image_with_infos(preds[i])
            self.area_tex.img *= 100
            print("Image: ", i)
            for k, v in info.items():
                print("   ", k, ": ", v)

            while True:
                if self.cfg.eval.demo:
                    k = self.area_tex.show()
                    if k == ord("q"):
                        break
                k = info_img.show()
                if k == ord("q"):
                    break
                k = texs[i].show()
                if k == ord("q"):
                    break
            self.area_tex.img *= 0.01
