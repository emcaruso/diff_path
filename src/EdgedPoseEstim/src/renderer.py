from utils_ema.diff_renderer import Renderer as DiffRenderer
from utils_ema.image import Image
import torch


class Renderer:

    def __init__(self, parent):
        self.cfg = parent.cfg
        self.parent = parent

    def get_sobel_synth(self, cam, obj):
        normals = self.render_normals(cam, obj)
        sobel = normals.sobel_diff(kernel_size=self.cfg.kernel_sobel)
        sobel.img[:, 0] = 0
        sobel.img[:, -1] = 0
        sobel.img[0, :] = 0
        sobel.img[-1, :] = 0
        return sobel

    @staticmethod
    def render_normals(cam, obj):
        gbuffers, pixs, dirs = DiffRenderer.get_buffers_pixels_dirs(
            cam, obj, channels=["normal"], with_antialiasing=True
        )
        del dirs, pixs
        torch.cuda.empty_cache()
        n = gbuffers["normal"]
        return Image(n, device=cam.device, dtype=n.dtype)
