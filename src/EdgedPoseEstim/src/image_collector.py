from utils_ema.basler_utils import frame_extractor
from utils_ema.general import load_function_from_path, load_class_from_path
from utils_ema.image import Image
import os
import sys
from pathlib import Path
from typing import List


class ImageCollector:
    def __init__(self, cfg) -> None:
        self.cfg = cfg

    def get_images_and_distmaps(self):
        images = self.get_images()
        distmaps = self.get_distmaps(images)
        return images, distmaps

    def get_images(self):

        if self.cfg.collect_images:
            self._collect_images()

        images = self._load_images()
        return images

    def get_distmaps(self, images):
        distmaps = []
        for image in images:
            distmaps.append([])
            for img in image:
                distmap = img.get_distance_map(
                    self.cfg.canny_sigma,
                    exp=self.cfg.exp_distmap,
                    edge_method="sobel",
                )
                distmaps[-1].append(distmap)

        return distmaps

    def _collect_images(self):
        Collector = load_class_from_path(self.cfg.paths.collector_path, "Collector")
        collector = Collector(self.cfg.paths.collector_cfg, self.cfg.paths.led_cfg)

        if self.cfg.images_only:
            collector.collect_images_only()
        else:
            collector.collect_while_tracking(
                manual=True, save_blender=False, synch=True
            )

    def _load_images(self) -> List[List[Image]]:
        # load collected images
        sys.path.append(self.cfg.paths.collector_dir)
        from load import CollectorLoader

        data_loader = CollectorLoader(
            os.path.join(self.cfg.paths.collector_in_dir, "config.yaml")
        )
        images = data_loader.get_images()

        images_out = []
        for i, cam in enumerate(images.values()):
            images_out.append([])
            for j, img in enumerate(cam.values()):
                images_out[i].append(img)

        return images_out
        #
        # images = []
        # img_dir = Path(self.cfg.paths.images_dir)
        # for i, cam_dir in enumerate(sorted(img_dir.iterdir())):
        #     images.append([])
        #     for j, img_file in enumerate(sorted(cam_dir.iterdir())):
        #         img = Image(path=str(img_file))
        #         images[i].append(img)
        # return images
