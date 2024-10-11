from data_collector import DataCollector
import numpy as np
from utils_ema.image import Image
from pathlib import Path
import torch
from torch.utils.data import DataLoader
from model import Model
from utils_ema.torch_utils import DiceLoss
from tqdm import tqdm
import os
import wandb


class Dataset:

    def __init__(self, cfg, subfolder):

        self.cfg = cfg
        self.dc = DataCollector(self.cfg)
        self.data = self.dc.load_data(subfolder=subfolder)

    @staticmethod
    def _generate_covariance_matrix(eigenvalue_range=(1, 5)):
        with torch.no_grad():
            # Step 1: Sample a uniform angle theta in [0, 2pi]
            theta = torch.rand(1) * 2 * torch.pi  # Angle in radians

            # Step 2: Create a 2D rotation matrix R(theta)
            R = torch.tensor(
                [
                    [torch.cos(theta), -torch.sin(theta)],
                    [torch.sin(theta), torch.cos(theta)],
                ]
            )

            # Step 3: Sample eigenvalues for scaling the axes
            lambda1 = (
                torch.rand(1) * (eigenvalue_range[1] - eigenvalue_range[0])
                + eigenvalue_range[0]
            )
            lambda2 = (
                torch.rand(1) * (eigenvalue_range[1] - eigenvalue_range[0])
                + eigenvalue_range[0]
            )

            # Step 4: Construct the diagonal eigenvalue matrix Lambda
            Lambda = torch.diag(torch.tensor([lambda1.item(), lambda2.item()]))

            # Step 5: Compute the covariance matrix Sigma = R * Lambda * R.T
            covariance_matrix = R @ Lambda @ R.T

            return covariance_matrix

    def _generate_pore(self, img):
        with torch.no_grad():

            # sample a random nonzero pixel in the image
            nonzero = torch.nonzero(img.sum(dim=0))
            idx = torch.randint(0, nonzero.shape[0], (1,))
            pixel = nonzero[idx, ...]

            # generate a random int number
            # n = torch.randint(1, self.cfg.train.n_gaussians, (1,))
            n = self.cfg.train.n_gaussians
            Z = torch.zeros((img.shape[1], img.shape[2]))

            x = torch.arange(img.shape[1]).float()
            y = torch.arange(img.shape[2]).float()
            xx, yy = torch.meshgrid(x, y, indexing="ij")

            for i in range(n):

                # generate a random covariance matrix
                cov = self._generate_covariance_matrix(self.cfg.train.pore_size_range)

                # generate the dark gaussian on the image
                xy = torch.stack([xx, yy], dim=-1)
                xy = xy - pixel
                xy = xy.unsqueeze(-2)
                cov_inv = torch.inverse(cov)
                z = torch.einsum("...i,ij,...j->...", xy, cov_inv, xy)
                z = torch.exp(-z)
                z = z / z.max()
                z = z.squeeze()

                Z = torch.maximum(Z, z)

                # sample a random pixel according to probability in z
                pixel = Image(torch.pow(Z, 2)).sample_pixels(1).squeeze()

                # swap the pixel coordinates
                pixel = pixel.flip(0)

            r = self.cfg.train.intensity_drop_range
            coeff = torch.rand(3) * (r[1] - r[0]) + r[0]
            rp = self.cfg.train.pow_range
            exp = torch.rand(1) * (rp[1] - rp[0]) + rp[0]
            Z = torch.pow(Z, exp)
            seg_mask = Z > self.cfg.train.mask_thresh
            seg_mask = seg_mask & (img.sum(dim=0) > 0)
            Z = Z.unsqueeze(-1).repeat(1, 1, 3)
            Z *= coeff
            Z = Z.permute(2, 0, 1)
            img_with_pore = img * (1 - Z)
            seg_mask = seg_mask.type(img_with_pore.dtype).unsqueeze(0)

        return img_with_pore, seg_mask

    def __getitem__(self, idx):
        with torch.no_grad():
            x = self.data[idx, ...]
            # generate pore or not
            if torch.rand(1) > self.cfg.train.pore_generation_ratio:
                x_, y = self._generate_pore(x)
            else:
                x_, y = x, torch.zeros_like(x)[:1, ...]
        return x_, y

    def demo(self):
        with torch.no_grad():
            import torchshow as ts

            for idx in range(self.__len__()):
                x = self.data[idx, ...]
                x_, y = self._generate_pore(x)
                ts.show(x)
                ts.show(x_)
                ts.show(y)

    def __len__(self):
        return self.data.shape[0]


class Trainer:

    def __init__(self, cfg):
        self.cfg = cfg
        self.device = torch.device(self.cfg.train.device)

    def _get_data_loader(self, subfolder):
        dataset = Dataset(self.cfg, subfolder)
        data_loader = DataLoader(dataset, **self.cfg.train.data_loader_params)
        return data_loader

    # def _save_model(self, model, epoch):
    #     if self.cfg.train.save_model:
    #         model.epoch = epoch
    #         print("Saving model at epoch ", epoch)
    #         if epoch % self.cfg.train.save_every == 0:
    #             out_dir = Path(self.cfg.paths.save_data) / "model"
    #             out_dir.mkdir(exist_ok=True, parents=True)
    #             torch.save(
    #                 model.state_dict(),
    #                 str(out_dir / "last.pth"),
    #             )
    #
    def load_model(self):
        model_path = Path(self.cfg.paths.save_data) / "model" / "last.pth"
        model = Model(self.cfg)
        model.load_state_dict(torch.load(str(model_path)))
        return model

    def _get_model(self):

        model_path = Path(self.cfg.paths.save_data) / "model" / "last.pth"
        model = Model(self.cfg)
        if model_path.exists() and self.cfg.train.load:
            model = self.load_model()
            print("Model loaded")
        model.to(self.cfg.train.device)

        print("New model from scratch")
        return model

    def _get_eval_textures(self):
        out_dir = os.path.join(
            self.cfg.paths.save_data, self.cfg.collect.eval.subfolder
        )
        out_dir_tex = Path(os.path.join(out_dir, "textures"))
        # load textures from out_dir_tex path
        textures = []
        for tex_path in out_dir_tex.iterdir():
            # load png
            tex = Image(path=str(tex_path))
            textures.append(tex)
        return textures

    def _eval_model(self, epoch, model, eval_textures):
        if epoch % self.cfg.train.eval_every == 0:
            with torch.no_grad():
                stride_factor = 0.5
                for tex in eval_textures:
                    result_list = []
                    patches = tex.patchify(self.cfg.train.patch_size, stride_factor)
                    patches = patches.permute(0, 3, 1, 2).to(self.device)

                    # divide into chunks
                    chunk_size = self.cfg.train.chunk_size_eval
                    for i in range(0, patches.shape[0], chunk_size):
                        out = model(patches[i : i + chunk_size])
                        result_list.append(out)
                    res = torch.cat(result_list, dim=0).to("cpu")
                    res = res.permute(0, 2, 3, 1)

                    img = Image.patches_to_image(
                        res,
                        stride_factor,
                        tex.img.shape[0],
                        tex.img.shape[1],
                        max_interp=True,
                    )
                    img.show(wk=1)
                    # # log img and tex with wandb
                    # wandb.log({"eval_original": [wandb.Image(img.img)]}, step=epoch)
                    # wandb.log({"eval_predicted": [wandb.Image(tex.img)]}, step=epoch)

                    # save model
                    #
                    break

    def _loss(self, y_hat, y):
        ce = torch.nn.functional.binary_cross_entropy(y_hat, y)
        dl = DiceLoss()(y_hat, y)
        w = self.cfg.train.dice_weight
        loss = w * dl + (1 - w) * ce
        return loss

    def train(self):

        # initialize model and optimizer
        data_loader_train = self._get_data_loader("train")
        eval_textures = self._get_eval_textures()
        model = self._get_model()
        model.train()
        optimizer = torch.optim.Adam(model.parameters(), lr=self.cfg.train.lr)
        scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(
            optimizer, T_max=self.cfg.train.epochs
        )

        progressbar = tqdm(range(self.cfg.train.epochs), desc="Training", leave=True)

        # Dataset(self.cfg).demo()

        for epoch in progressbar:

            loss_total = 0
            for x, y in tqdm(data_loader_train, leave=False):
                x, y = x.to(self.device, non_blocking=True), y.to(
                    self.device, non_blocking=True
                )

                y_hat = model(x)

                # show train
                Image(y.permute(0, 2, 3, 1)[0, ...].cpu()).show(wk=1, img_name="y")
                Image(y_hat.permute(0, 2, 3, 1)[0, ...].cpu()).show(
                    wk=1, img_name="y_hat"
                )

                loss = self._loss(y_hat, y)
                loss.backward()

                loss_total += loss.item()

                optimizer.step()
                optimizer.zero_grad()

            progressbar.set_postfix({"loss": loss_total})
            scheduler.step()

            # self._eval_model(epoch, model, eval_textures)
            #
            # self._save_model(model, epoch)
            # self._save_texture(model, epoch, x=x[0, 0], show=True)
