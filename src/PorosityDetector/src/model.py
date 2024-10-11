import torch
from utils_ema.objects import Object
from utils_ema.texture import Texture
from utils_ema.general import load_module_from_path
from utils_ema.image import Image
from pathlib import Path
import os
import models.segmentation_models_pytorch as smp

script_dir = Path(os.path.dirname(os.path.realpath(__file__)))


class Model(torch.nn.Module):

    def __init__(self, cfg):
        super(Model, self).__init__()
        self.cfg = cfg
        self.model = self._build_model()
        self.epoch = 0

    def _get_unet(self):

        model = smp.Unet(
            encoder_name=self.cfg.train.model.name,
            in_channels=self.cfg.train.model.input_channels,
            classes=1,
            activation="sigmoid",
            encoder_depth=self.cfg.train.model.encoder_depth,
            decoder_channels=self.cfg.train.model.decoder_channels,
            decoder_use_batchnorm=self.cfg.train.model.decoder_channels,
        )
        model.to(self.cfg.train.device)

        # # Load a pretrained model
        # if self.cfg.train.model.load_weights:
        #     model.load_state_dict(
        #         torch.load(config["exp"]["load_weights"], map_location=device)
        #     )
        #     print(f'Loaded model weights from {config["exp"]["load_weights"]}')

        return model

    # define unet model in torch

    # build an mlp
    def _build_model(self):

        # unet
        unet = self._get_unet()

        unet = unet.to(torch.device(self.cfg.train.device))
        return unet

    def forward(self, x):
        y = self.model(x)
        return y
