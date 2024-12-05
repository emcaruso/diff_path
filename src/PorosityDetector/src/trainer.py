from data_collector import DataCollector
import torchshow as ts
import gc
import time
import randomname
import cv2
import torchshow as ts
import numpy as np
from utils_ema.image import Image
from utils_ema.texture import Texture
from pathlib import Path
import torch
from torch.utils.data import DataLoader
from model import Model
from utils_ema.torch_utils import DiceLoss, set_seed, clear_cuda_tensors
from tqdm import tqdm
import os
import wandb
from dataset import Dataset
import models.segmentation_models_pytorch as smp


class Trainer:

    def __init__(self, cfg):
        self.cfg = cfg
        self.device = torch.device(self.cfg.train.device)
        set_seed(self.cfg.train.seed)
        self.mask, self.mask_idxs = self.mask_data(
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

    def _get_data_loader(self, mode, train=False):
        dataset = Dataset(self.cfg, mode, train=train)
        data_loader = DataLoader(dataset, **self.cfg[mode].data_loader_params)
        return data_loader

    def _save_model(self, model, epoch, name):
        if self.cfg.train.save_model and epoch % self.cfg.train.eval_every == 0:
            model.epoch = epoch
            print("Saving model at epoch ", epoch)
            out_dir = Path(self.cfg.paths.save_data) / "model"
            out_dir.mkdir(exist_ok=True, parents=True)
            torch.save(
                model.state_dict(),
                str(out_dir / (name + ".pth")),
            )

    def load_model(self, model_path):
        model = Model(self.cfg)
        model.load_state_dict(torch.load(model_path))
        return model

    def _get_model(self, name):

        model_path = Path(self.cfg.paths.save_data) / "model" / (name + ".pth")
        if model_path.exists() and self.cfg.train.load:
            model = self.load_model(str(model_path))
            print("Model loaded")
        else:
            model = Model(self.cfg)
            print("New model from scratch")
        model.to(self.cfg.train.device)
        return model

    def _get_eval_textures_generator(self):
        out_dir = os.path.join(
            self.cfg.paths.save_data, self.cfg.collect.eval.subfolder
        )
        out_dir_tex = Path(os.path.join(out_dir, "textures"))
        # load textures from out_dir_tex path
        textures = []
        for i, tex_dir in enumerate(sorted(out_dir_tex.iterdir())):
            for tex_path in sorted(tex_dir.iterdir()):
                tex = Image(path=str(tex_path))
                yield i, tex

    def _get_eval_textures_labels(self):
        # if path xists
        labels_dir = (
            Path(self.cfg.paths.save_data) / self.cfg.collect.eval.subfolder / "labels"
        )
        if labels_dir.exists():
            labels = []
            if labels_dir:
                for label_path in sorted(labels_dir.iterdir()):
                    label = Image(path=str(label_path), gray=True)
                    labels.append(label.img.unsqueeze(-1).to(self.device))
            return labels
        return None

    def _eval_model(self, epoch, model, data_load_train, data_load_eval):
        eval_textures_generator = self._get_eval_textures_generator()
        model.eval()
        # if epoch % self.cfg.train.eval_every == 0:
        if epoch % self.cfg.train.eval_every == 0 and epoch > 0:
            with torch.no_grad():

                idxs_all = data_load_eval.dataset.idxs_all
                loss_total = {}
                for idx in idxs_all:
                    data_load_eval.dataset.idxs = [idx]

                    ids = []
                    y_list = []
                    for x, y, id in tqdm(data_load_eval, leave=False):
                        x, y = x.to(self.device, non_blocking=True), y.to(
                            self.device, non_blocking=True
                        )
                        mask = x > 0
                        x = data_load_train.dataset.norm(x)
                        y_hat = model(x)
                        y_hat *= mask

                        loss = self._loss(y_hat, y)

                        ids.append(id)
                        y_list.append(y_hat)

                        if loss_total == {}:
                            loss_total = {k: v.item() for k, v in loss.items()}
                        else:
                            for k, v in loss.items():
                                loss_total[k] += v.item()
                    ids = torch.cat(ids)
                    y_list = torch.cat(y_list)

                    d = torch.nonzero(ids[1:] < ids[:-1]).squeeze() + 1
                    split_indices = torch.cat(
                        [torch.tensor([0]), d, torch.tensor([len(ids)])]
                    )
                    ids_sub = [
                        ids[split_indices[i] : split_indices[i + 1]]
                        for i in range(len(split_indices) - 1)
                    ]
                    y_list_sub = [
                        y_list[split_indices[i] : split_indices[i + 1]]
                        for i in range(len(split_indices) - 1)
                    ]
                    for it, ids in enumerate(tqdm(ids_sub)):
                        patches = torch.zeros(
                            self.patches_shape, device=self.device, dtype=torch.float32
                        )
                        y_list = y_list_sub[it]
                        patches[ids] = y_list.permute(0, 2, 3, 1)
                        img = Image.patches_to_image(
                            patches,
                            self.cfg.train.stride_factor,
                            self.mask.shape[0],
                            self.mask.shape[1],
                            max_interp=True,
                            device=patches.device,
                        )
                        img *= self.mask
                        # Image(img).show(wk=1)
                        if self.cfg.train.show or self.cfg.wandb.log_images_eval:

                            tex = eval_textures_generator.__next__()[1].to(self.device)
                            img_show = Image.merge_images(img, tex, 0.5)

                            if self.cfg.train.show:
                                img_show.show(wk=1, img_name="eval")
                            if self.cfg.wandb.log_images_eval:
                                wandb.log(
                                    {
                                        str(idx).zfill(2)
                                        + "_"
                                        + str(it).zfill(2)
                                        + "_prediction_overlay": [
                                            wandb.Image(img_show.img.cpu().numpy())
                                        ]
                                    },
                                    step=epoch,
                                )
                                wandb.log(
                                    {
                                        str(idx).zfill(2)
                                        + "_"
                                        + str(it).zfill(2)
                                        + "_prediction": [
                                            wandb.Image(img.cpu().numpy())
                                        ]
                                    },
                                    step=epoch,
                                )

                    wandb.log(
                        {"loss_eval_" + str(idx): np.array(loss_total["total"])},
                        step=epoch,
                    )

                    clear_cuda_tensors()

        # eval_textures_generator = self._get_eval_textures_generator()
        # eval_textures_labels = self._get_eval_textures_labels()
        # sf = self.cfg.train.stride_factor
        # model.eval()
        # if epoch % self.cfg.train.eval_every == 0:
        #     # if epoch % self.cfg.train.eval_every == 0 and epoch > 0:
        #     with torch.no_grad():
        #
        #         clear_cuda_tensors()
        #
        #         for idx in self.
        #
        #         images = []
        #         losses = []
        #
        #         for it, (tex_id, tex) in enumerate(
        #             tqdm(eval_textures_generator, desc="eval textures")
        #         ):
        #             tex = tex.to(self.device)
        #             result_list = []
        #             patches = tex.patchify(self.cfg.train.patch_size, sf).mean(
        #                 dim=-1, keepdim=True
        #             )
        #
        #             if self.cfg.train.channels == 1:
        #                 patches = patches.mean(dim=-1, keepdim=True)
        #
        #             patches = patches.permute(0, 3, 1, 2).to(self.device)
        #             patches_zeros = (
        #                 torch.zeros_like(patches).permute(0, 2, 3, 1).to(self.device)
        #             )
        #             patches = patches[self.mask_idxs]
        #
        #             # divide into chunks
        #             chunk_size = self.cfg.eval.chunk_size
        #             # chunk_size = 1
        #             for i in range(0, patches.shape[0], chunk_size):
        #                 x = patches[i : i + chunk_size]
        #                 # ratio = (x != 0).sum(dim=(1, 2, 3)) / (x[0].numel())
        #                 # if ratio > self.cfg.collect.min_patch_ratio:
        #                 x_ = data_load.dataset.norm(x)
        #
        #                 out = model(x_)
        #                 # out = out > self.cfg.train.pred_thresh
        #                 # if i == 78:
        #                 #     self._show(out, out, x)
        #                 #     # print(i)
        #                 #     # cv2.waitKey(0)
        #                 # else:
        #                 #     out = torch.zeros_like(x[:, :1, ...])
        #                 result_list.append(out)
        #             res = torch.cat(result_list, dim=0)
        #             res = res.permute(0, 2, 3, 1)
        #             patches_zeros[self.mask_idxs] = res
        #
        #             img = Image.patches_to_image(
        #                 patches_zeros,
        #                 sf,
        #                 tex.img.shape[0],
        #                 tex.img.shape[1],
        #                 max_interp=True,
        #                 device=res.device,
        #             )
        #             img *= self.mask
        #             img *= tex.img.sum(dim=-1, keepdim=True) > 0.5
        #             images.append(img)
        #
        #             if eval_textures_labels is not None:
        #                 losses.append(
        #                     self._loss(img, eval_textures_labels[tex_id])[
        #                         "total"
        #                     ].item()
        #                 )
        #
        #             if self.cfg.train.show or self.cfg.wandb.log_images_eval:
        #
        #                 img_show = Image.merge_images(img, tex, 0.5)
        #
        #                 if self.cfg.train.show:
        #                     img_show.show(wk=1, img_name="eval")
        #                 if self.cfg.wandb.log_images_eval:
        #                     wandb.log(
        #                         {
        #                             str(it).zfill(2)
        #                             + "_prediction_overlay": [
        #                                 wandb.Image(img_show.numpy())
        #                             ]
        #                         },
        #                         step=epoch,
        #                     )
        #                     wandb.log(
        #                         {
        #                             str(it).zfill(2)
        #                             + "_prediction": [wandb.Image(img.cpu().numpy())]
        #                         },
        #                         step=epoch,
        #                     )
        #
        #             clear_cuda_tensors()
        #
        #         if eval_textures_labels is not None:
        #             wandb.log({"loss_eval": np.array(losses).mean()}, step=epoch)

        # pred = torch.cat(images, dim=-1)
        # # weights = torch.cat(
        # #     [tex.img.mean(dim=-1, keepdim=True) for tex in eval_textures],
        # #     dim=-1,
        # # )
        # # weights /= weights.max()
        # # out = pred * weights
        # # weights = torch.ones(pred.shape)
        # pred = getattr(torch, op)(pred, dim=-1)
        # pred = pred > 0.2
        #
        # if self.cfg.train.show or self.cfg.wandb.log_images_eval:
        #
        #     img_show = Image.merge_images(Image(pred), tex, 0.2)
        #
        #     if self.cfg.train.show:
        #         img_show.show(wk=1, img_name="eval_1")
        #     if self.cfg.wandb.log_images_eval:
        #         wandb.log(
        #             {"eval_predicted_final_1": [wandb.Image(img_show.numpy())]},
        #             step=epoch,
        # )

    def _loss(self, y_hat, y):
        loss = {}
        # w1 = self.cfg.train.weight_background
        # w2 = 1 - self.cfg.train.weight_background
        # weights = torch.where(y == 1, w2, w1)

        # check if weight is hiher than 0
        loss_total = torch.zeros(1, device=y.device)
        if self.cfg.train.loss.bce.weight > 0:
            bce = torch.nn.functional.binary_cross_entropy(y_hat, y)
            loss["bce"] = bce
            loss_total += self.cfg.train.loss.bce.weight * bce
        if self.cfg.train.loss.dice.weight > 0:
            dice = DiceLoss()(y_hat, y)
            loss["dice"] = dice
            loss_total += self.cfg.train.loss.bce.weight * dice
        if self.cfg.train.loss.tversky.weight > 0:
            tversky = smp.losses.TverskyLoss(**self.cfg.train.loss.tversky.params)(
                y_hat, y
            )
            loss["tversky"] = tversky
            loss_total += self.cfg.train.loss.tversky.weight * tversky

        loss["total"] = loss_total

        return loss

    def _show(self, y_hat, y, x):
        if self.cfg.train.show:
            Image(x.permute(0, 2, 3, 1)[0, ...].cpu()).show(wk=1, img_name="x")
            Image(y.permute(0, 2, 3, 1)[0, ...].cpu()).show(wk=1, img_name="y")
            Image(y_hat.permute(0, 2, 3, 1)[0, ...].cpu()).show(wk=1, img_name="y_hat")

    @staticmethod
    def mask_data(mask_path, device, patch_size, stride_factor, min_patch_ratio):
        mask = (Texture.init_from_path(mask_path).gray().unsqueeze(-1)).to(device)
        patches = (
            Image(mask).patchify(patch_size, stride_factor).mean(dim=-1, keepdim=True)
        )
        mask_idxs = (patches != 0).sum(dim=(1, 2, 3)) > min_patch_ratio
        return mask, mask_idxs

    def train(self):

        data_loader_train = self._get_data_loader("train", train=True)
        data_loader_eval = self._get_data_loader("eval", train=False)
        group_name = randomname.get_name()

        for i in range(self.cfg.train.ensemble_models):
            name = "model_" + str(i).zfill(2)

            if self.cfg.train.demo_pores:
                Dataset(self.cfg, subfolder="train").demo()

            # wandb
            if self.cfg.wandb.disabled:
                os.environ["WANDB_DISABLED"] = "true"
                wandb.init(mode="disabled")
            else:
                wandb.init(
                    project=self.cfg.wandb.project,
                    config=dict(self.cfg),
                    group=group_name,
                    name=name,
                    reinit=True,
                )

            # initialize model and optimizer
            model = self._get_model("model_" + str(i).zfill(2))
            model.train()
            optimizer = torch.optim.Adam(model.parameters(), lr=self.cfg.train.lr)
            scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(
                optimizer, T_max=self.cfg.train.epochs
            )

            progressbar = tqdm(
                range(self.cfg.train.epochs), desc="Training", leave=True
            )

            for epoch in progressbar:

                self._eval_model(epoch, model, data_loader_train, data_loader_eval)
                self._save_model(model, epoch, name)

                loss_total = {}
                for x, y, id in tqdm(data_loader_train, leave=False):
                    x, y = x.to(self.device, non_blocking=True), y.to(
                        self.device, non_blocking=True
                    )

                    y_hat = model(x)

                    loss = self._loss(y_hat, y)

                    # add weight decay
                    for param in model.parameters():
                        loss["total"] += self.cfg.train.weight_decay * torch.norm(
                            param, 2
                        )

                    loss["total"].backward()

                    optimizer.step()
                    optimizer.zero_grad()

                    # show images for live debugging
                    self._show(y_hat, y, data_loader_train.dataset.denormalize(x))

                    if loss_total == {}:
                        loss_total = {k: v.item() for k, v in loss.items()}
                    else:
                        for k, v in loss.items():
                            loss_total[k] += v.item()

                for k, v in loss_total.items():
                    wandb.log({"loss_" + k: v}, step=epoch)
                progressbar.set_postfix({"loss": loss_total["total"]})
                if self.cfg.train.use_scheduler:
                    scheduler.step()

            wandb.finish()
