import torch
from tqdm import tqdm
import numpy as np
import h5py
import cv2
from data_collector import DataCollector
from utils_ema.image import Image
import torch
from collections import defaultdict

# import albumentations as A
from torchvision.transforms import v2
from torch.utils.data import DataLoader
from pathlib import Path
import os

# from albumentations.pytorch import ToTensorV2


class Dataset:

    def __init__(self, cfg, subfolder, train=True):

        self.cfg = cfg
        self.subfolder = subfolder
        self.data = self._load_data()
        self.statistics = self._compute_statistics()
        self.transf_x = self._transforms_train(self.cfg.train.aug_x)
        self.transf_xy = self._transforms_train(self.cfg.train.aug_xy)
        self.norm = self._normalize_transf()
        self._train = train

    def _load_data(self):
        self.x_h5_dir = sorted(
            (
                Path(self.cfg.paths.save_data) / self.subfolder / "patches" / "x"
            ).iterdir()
        )
        self.y_h5_dir = sorted(
            (
                Path(self.cfg.paths.save_data) / self.subfolder / "patches" / "y"
            ).iterdir()
        )
        self.id_h5_dir = sorted(
            (
                Path(self.cfg.paths.save_data) / self.subfolder / "patches" / "id"
            ).iterdir()
        )
        self.x_h5_files = [f for f in self.x_h5_dir if f.suffix == ".h5"]
        self.y_h5_files = [f for f in self.y_h5_dir if f.suffix == ".h5"]
        self.id_h5_files = [f for f in self.id_h5_dir if f.suffix == ".h5"]
        self.has_labels = self.cfg.collect[self.subfolder].has_labels
        self.n = np.array([int(len(h5py.File(f, "r").keys())) for f in self.x_h5_files])
        self.idxs_all = [i for i in range(len(self.n))]
        self.idxs = [i for i in range(len(self.n))]

    def _compute_statistics(self):
        stats_path = (
            Path(self.cfg.paths.save_data) / self.subfolder / "patches" / "stats.npy"
        )
        if os.path.exists(stats_path):
            stats = np.load(stats_path, allow_pickle=True).tolist()

        else:
            stats = defaultdict(dict)
            for ch in [1, 3]:
                mean = torch.zeros(ch)
                std = torch.zeros(ch)
                for i in tqdm(
                    range((self.n).sum()), desc="Computing statistics, ch: " + str(ch)
                ):
                    x = self.get_item(i)[0][:ch, ...]
                    if x[x > 0].numel() == 0:
                        continue
                    mean += x.mean(dim=[1, 2])
                    std += x.std(dim=[1, 2])
                stats[ch]["mean"] = mean / sum(self.n)
                stats[ch]["std"] = std / sum(self.n)

            # save npy
            np.save(stats_path, dict(stats), allow_pickle=True)

        return stats

    def normalize(self, x):
        return self.norm(x)

    def denormalize(self, x):
        with torch.no_grad():
            x = x.permute(0, 2, 3, 1)
            mean = self.statistics[self.cfg.train.channels]["mean"].to(x.device)
            std = self.statistics[self.cfg.train.channels]["std"].to(x.device)
            x = x * std + mean
            x = x.permute(0, 3, 1, 2)
            return x

    def _transforms_train(self, dictionary):
        transform_list = [getattr(v2, k)(**v) for k, v in dictionary.items()]
        T = v2.Compose(transform_list)
        return T

    def _normalize_transf(self):
        if not self.cfg.train.normalize_colors:
            return lambda x: x
        else:
            mean = self.statistics[self.cfg.train.channels]["mean"]
            std = self.statistics[self.cfg.train.channels]["std"]
            T = v2.Compose([v2.Normalize(mean=mean, std=std)])
            return T

    @staticmethod
    def _generate_covariance_matrix(eigenvalue_range):
        with torch.no_grad():

            e = torch.tensor(eigenvalue_range)

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
            rnd_scale = torch.rand(1)
            rnd_prop = torch.rand(1)
            scale = torch.pow(rnd_scale * (e[1] - e[0]) + e[0], 4)
            lambda1 = rnd_prop * scale
            lambda2 = (1 - rnd_prop) * scale

            # Step 4: Construct the diagonal eigenvalue matrix Lambda
            Lambda = torch.diag(torch.tensor([lambda1.item(), lambda2.item()]))

            # Step 5: Compute the covariance matrix Sigma = R * Lambda * R.T
            covariance_matrix = R @ Lambda @ R.T

            return covariance_matrix

    @staticmethod
    def _sharper(x, sharp):
        x = x - x.min()
        x = x / x.max()
        x -= 0.25
        x = torch.sigmoid(x * (sharp**10))
        x = x - x.min()
        x = x / x.max()
        return x

    def _generate_pore(self, img):
        with torch.no_grad():

            # sample a random nonzero pixel in the image
            mask = img.mean(dim=0) > self.cfg.train.pore_gen.thresh_intensity
            nonzero = torch.nonzero(mask)
            if nonzero.shape[0] == 0:
                return img, torch.zeros_like(img)[:1, ...]

            idx = torch.randint(0, nonzero.shape[0], (1,))
            pixel = nonzero[idx, ...]

            # generate a random int number
            if self.cfg.train.pore_gen.n_gaussians == 1:
                n = 1
            else:
                n = torch.randint(1, self.cfg.train.pore_gen.n_gaussians, (1,))
            # n = self.cfg.train.pore_gen.n_gaussians

            x = torch.arange(img.shape[1]).float()
            y = torch.arange(img.shape[2]).float()
            xx, yy = torch.meshgrid(x, y, indexing="ij")

            ch = self.cfg.train.channels
            r = self.cfg.train.pore_gen.intensity_drop_range
            # rp = self.cfg.train.pore_gen.pow_range
            rs = self.cfg.train.pore_gen.sharp_factor_range
            Z = torch.zeros((img.shape[1], img.shape[2], ch))
            seg_mask = torch.zeros((img.shape[1], img.shape[2]))
            coeff_2 = torch.rand(ch) * (r[1] - r[0]) + r[0]

            for i in range(n):

                # generate a random covariance matrix
                cov = self._generate_covariance_matrix(
                    self.cfg.train.pore_gen.pore_size_range
                )

                coeff = torch.rand(ch) * (r[1] - r[0]) + r[0]
                # exp = torch.rand(1) * (rp[1] - rp[0]) + rp[0]
                sharp = (torch.rand(1) * (rs[1] - rs[0]) + rs[0]).item()

                # generate the dark gaussian on the image
                xy = torch.stack([xx, yy], dim=-1)
                xy = xy - pixel
                xy = xy.unsqueeze(-2)
                cov_inv = torch.inverse(cov)

                z = torch.einsum("...i,ij,...j->...", xy, cov_inv, xy)
                z = torch.exp(-z)
                z = z.squeeze()
                z = self._sharper(z, sharp)

                if torch.rand(1) < self.cfg.train.pore_gen.p_flat:
                    z += (z > self.cfg.train.mask_thresh).to(z.dtype) * torch.rand(1)
                    z = z / z.max()
                # else:
                #     z = torch.pow(z, exp)
                #     # z = Image(z).get_sharpen_image(sharp).img[..., 0]

                # update seg_mask
                seg_mask_ = z > self.cfg.train.mask_thresh
                seg_mask = torch.logical_or(seg_mask, seg_mask_)

                noise_intensity = self.cfg.train.pore_gen.noise_intensity * torch.rand(
                    1
                )

                z *= 1 + (torch.randn_like(z) * noise_intensity)
                z = z.unsqueeze(-1).repeat(1, 1, ch)
                z *= coeff
                Z = torch.maximum(Z, z)
                z = torch.clamp(z, 0.0, 1.0)
                if Z.sum() < 0.0001 or Z.isnan().sum() > 0 or Z.isinf().sum() > 0:
                    continue

                pixel = Image(Z).sample_pixels(1).squeeze()

                # swap the pixel coordinates
                pixel = pixel.flip(0)

            seg_mask = seg_mask & (img.sum(dim=0) > 0)
            Z = Z.permute(2, 0, 1)
            if torch.rand(1) < self.cfg.train.pore_gen.p_mul:
                img_with_pore = img * (1 - Z)
            else:
                # instead of multiplying img, we substitute values
                img_with_pore = img.clone()
                img_with_pore[:, seg_mask] = (1 - Z)[:, seg_mask] * img[
                    :, seg_mask
                ].mean()

                # mask = (Z > self.cfg.train.mask_thresh).squeeze()
                # c = img[:, mask].mean() * coeff_2
                # img_with_pore = img.clone()
                # img_with_pore[mask] = (1 - Z) * c.mean()
            seg_mask = seg_mask.type(img_with_pore.dtype).unsqueeze(0)

        return img_with_pore, seg_mask

    def get_item(self, idx):
        # from idx find id and i

        n = 0
        for i in self.idxs:
            n_off = n
            n += self.n[i]
            if idx < n:
                break

        id_ = idx - n_off
        with h5py.File(self.x_h5_files[i], "r") as hdf:
            x = torch.from_numpy(np.array(hdf[f"{id_}"]))

        with h5py.File(self.id_h5_files[i], "r") as hdf:
            id = torch.from_numpy(np.array(hdf[f"{id_}"]))

        if self.has_labels:
            with h5py.File(self.y_h5_files[i], "r") as hdf:
                y = torch.from_numpy(np.array(hdf[f"{id_}"]))
        else:
            y = torch.zeros_like(x)[:1, ...]
        return x, y, id

    def __getitem__(self, idx):
        x, y, id = self.get_item(idx)
        if self.cfg.train.channels == 1:
            x = x.mean(dim=0, keepdim=True)
        # generate pore or not
        if self._train:
            p = self.cfg.train.pore_gen.pore_generation_ratio
            if self.cfg.train.pore_gen.adaptive_prob:
                p *= (x > 0).sum() / x.numel()
            if torch.rand(1) < p:
                x, y = self._generate_pore(x)
            else:
                x, y = x, torch.zeros_like(x)[:1, ...]
            out = self.transf_xy(torch.cat((x, y), dim=0))
            y = out[-1:, ...]
            x = out[:-1, ...]
            mask = x > 0
            x = self.transf_x(x)
            x = mask * x
            x = self.norm(x)
            return x, y, id
        else:
            return x, y, id

    def demo(self):
        with torch.no_grad():
            import torchshow as ts

            while True:
                for idx in range(self.__len__()):
                    x = self.get_item(idx)[0]
                    x_, y = self._generate_pore(x)
                    ts.show(x)
                    ts.show(y)
                    ts.show(x_)

    def __len__(self):
        return sum([self.n[i] for i in self.idxs])
