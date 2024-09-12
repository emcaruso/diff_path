from collections import defaultdict


class DataCollector:

    def __init__(self, cfg):
        self.cfg = cfg

    def _collect_images(self):
        # collector
        # use collector to collect images
        self.images = None

    def collect_data(self):

        self._collect_images()
        exit(1)

        # init data
        data = defaultdict(lambda: defaultdict({}))

        # for each cam
        for cam_id, cam in enumerate(cams):

            # for each image for cam
            for image in cam:

                # collect vals and pixels
                vals, pixels = self._collect_vals_and_pixels(image)

                # data["cam_" + str(i).zfill(3)] = {}

        pass
