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
        # self._mesh_to_textures()

    def _mesh_to_textures(self):

        # load mesh
        mesh = read_mesh(self.cfg.paths.mesh_path)

        # get area texture
        self.area_tex = mesh.get_texture_3darea(self.mask.shape[0])

    def load_model(self, model_path):
        model = Model(self.cfg)
        model.load_state_dict(torch.load(model_path))
        model.to(self.device)
        return model

    def _get_generator(self, folder):
        for img_path in sorted(folder.iterdir()):
            tex = Image(path=str(img_path))
            yield tex

    def _get_eval_textures_generator(self, idx):
        out_dir = os.path.join(
            self.cfg.paths.save_data, self.cfg.collect.eval.subfolder
        )
        out_dir_tex = Path(os.path.join(out_dir, "textures"))
        # load textures from out_dir_tex path
        textures = []
        tex_dir = sorted(out_dir_tex.iterdir())[idx]
        tex_paths = sorted(tex_dir.iterdir())
        return Image(path=str(tex_paths[0])), Image(path=str(tex_paths[-1]))
        # tex =
        # yield i, tex

    # def _get_eval_textures_generator(self):
    #     out_dir = os.path.join(
    #         self.cfg.paths.save_data, self.cfg.collect.eval.subfolder
    #     )
    #     out_dir_tex = Path(os.path.join(out_dir, "textures"))
    #     # load textures from out_dir_tex path
    #     return [self._get_generator(folder) for folder in sorted(out_dir_tex.iterdir())]
    #     generator = self._get_generator(folder)

    def _get_data_loader(self, mode, train=False):
        dataset = Dataset(self.cfg, mode, train=train)
        data_loader = DataLoader(dataset, **self.cfg[mode].data_loader_params)
        return data_loader

    def _compute_images(self):
        data_load_train = self._get_data_loader("train", train=True)
        data_load_eval = self._get_data_loader("eval", train=False)
        imgs = []
        texs = []
        for it in data_load_eval.dataset.idxs_all:
            data_load_eval.dataset.idxs = [it]
            eval_tex_0, eval_tex_1 = self._get_eval_textures_generator(
                data_load_eval.dataset.idxs[0]
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

                        if self.cfg.eval.show_patches:
                            ts.show(x + y_hat * 2)

                        ids.append(id)
                        y_list.append(y_hat)

                    ids = torch.cat(ids).to(self.device)
                    y_list = torch.cat(y_list).to(self.device).permute(0, 2, 3, 1)
                    # threshold
                    y_list = (y_list > 0.5).float()

                    # final_pred[ids] += y_list.permute(0, 2, 3, 1)

                    # updates = torch.ones_like(
                    #     ids, dtype=y_list.dtype
                    # )  # Tensor of +1 for each index
                    # y_list.index_add_(0, ids, updates)

                    b, W, H, _ = final_pred.shape
                    N = len(ids)
                    final_pred_flat = final_pred.view(b, -1)  # Shape [b, W*H*1]
                    y_list_flat = y_list.view(N, -1)  # Shape [N, W*H*1]
                    final_pred_flat.index_add_(0, ids, y_list_flat)
                    final_pred = final_pred_flat.view(b, W, H, 1)

            # threshold
            # final_pred = final_pred > self.cfg.train.eval_thresh
            # final_pred = final_pred.float()
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
            img = img > self.cfg.eval.eval_thresh
            texs.append(Image(eval_tex_0.img + eval_tex_1.img))
            # img_show = Image.merge_images(img.cpu(), tex.img, 0.5)
            imgs.append(Image(img))

        return imgs, texs

        # while True:
        #     img.show(wk=0)
        #     tex.show(wk=0)
        #

    def evaluate(self):

        preds, texs = self._compute_images()
        for i in range(len(preds)):

            num_clusters, centroids, multi_mask = preds[i].process_clusters()

            colored_image = Image.get_multimask_with_colormap(multi_mask)
            while True:
                k = colored_image.show()
                if k == ord("q"):
                    break
                texs[i].show()
                if k == ord("q"):
                    break
