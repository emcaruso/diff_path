import torch
from utils_ema.objects import Object
from utils_ema.texture import Texture
from utils_ema.general import load_function_from_path
from utils_ema.image import Image
from pathlib import Path
import os
from encoding import encoding

script_dir = Path(os.path.dirname(os.path.realpath(__file__)))


class PosEncoderCustom(torch.nn.Module):

    def __init__(self, encoder_x, encoder_uv):
        super(PosEncoderCustom, self).__init__()
        self.encoder_x = encoder_x
        self.encoder_uv = encoder_uv
        self.output_dim = encoder_x.output_dim + encoder_uv.output_dim

    def forward(self, input):
        x = input[:, :1]
        uv = input[:, 1:]
        x = self.encoder_x(x)
        uv = self.encoder_uv(uv)
        y = torch.cat((x, uv), dim=1)
        return y


class Model(torch.nn.Module):

    def __init__(self, cfg):
        super(Model, self).__init__()
        self.cfg = cfg
        self.model = self._build_model()
        self.epoch = 0

    def _get_encoder_part(self, enc_type, **kwargs):
        if enc_type == "None":
            encoder = encoding.NoEncoding()
        elif enc_type == "frequency":
            encoder = encoding.Frequency(**kwargs)
        elif enc_type == "hash_grid":
            encoder = encoding.MultiResHashGrid(**kwargs)
        return encoder

    def _get_main_encoder(self, encoder_x, encoder_uv):
        encoder = torch.nn.Module()

    def _get_positional_encoder(self):

        # encoding x
        enc_type = self.cfg.model.encoder_x.type
        kwargs = self.cfg.model.encoder_x.kwargs
        encoder_x = self._get_encoder_part(enc_type, **kwargs)

        # encoding_uv
        enc_type = self.cfg.model.encoder_uv.type
        kwargs = self.cfg.model.encoder_uv.kwargs
        encoder_uv = self._get_encoder_part(enc_type, **kwargs)

        encoder = PosEncoderCustom(encoder_x, encoder_uv)

        return encoder

    def _get_mlp(self, input_size):

        # input
        input = torch.nn.Linear(input_size, self.cfg.model.hidden_size)

        # hidden layers
        hidden_layers = []

        for i in range(self.cfg.model.n_layers):
            hidden_layers.append(
                torch.nn.Linear(
                    self.cfg.model.hidden_size,
                    self.cfg.model.hidden_size,
                )
            )
            hidden_layers.append(torch.nn.ReLU())

        # output
        output = torch.nn.Linear(self.cfg.model.hidden_size, 3)

        # model
        mlp = torch.nn.Sequential(input, *hidden_layers, output)

        return mlp

    # build an mlp
    def _build_model(self):

        # encoder
        encoder = self._get_positional_encoder()

        # mlp
        mlp = self._get_mlp(encoder.output_dim)

        # model
        model = torch.nn.Sequential(encoder, mlp)
        model = model.to(torch.device(self.cfg.train.device))
        return model

    def forward(self, x):
        y = self.model(x)
        return y

    def get_texture(self, x_val=0):
        with torch.no_grad():
            res = self.cfg.collect.texture_res

            texture = torch.zeros((res, res, 3))

            # get mask texture from mesh
            obj = Object(mesh=self.cfg.paths.mesh_path)
            texture_mask = obj.mesh.get_texture_mask(res)

            pixels = torch.nonzero(texture_mask)
            uvs = pixels / res
            uvs = uvs.to(self.cfg.eval.device)
            print(uvs.shape)

            # extend uvs with x=0
            x = torch.ones(uvs.shape[0], 1).to(self.cfg.eval.device) * x_val
            uvs = torch.cat((x, uvs), dim=1)

            # chunkenize uvs
            n = self.cfg.eval.chunk_size
            uvs = torch.split(uvs, n)
            for i, uv in enumerate(uvs):
                uv = uv.to(self.cfg.eval.device)
                vals = self.forward(uv)
                texture[
                    pixels[i * n : i * n + len(uv), 0],
                    pixels[i * n : i * n + len(uv), 1],
                ] = vals.cpu()
            img = Image(texture)
            img.show()

        return img
