from utils_ema.basler_utils import frame_extractor
from utils_ema.config_utils import load_yaml
from utils_ema.image import Image
from utils_ema.general import print_hash
import subprocess
import cv2
import os
import numpy as np
import argparse

# get 'init' bool value from command line
parser = argparse.ArgumentParser(description="Compare images")
parser.add_argument(
    "--init",
    help="initialize images",
    action="store_true",
)
args = parser.parse_args()
init = args.init

if init:
    print_hash("Initializing images for calib evaluation")
else:
    print_hash("Comparing images for calib evaluation")

# load yaml
script_dir = os.path.dirname(os.path.realpath(__file__))
config_path = os.path.join(script_dir, "..", "configs", "calibration.yaml")
cfg = load_yaml(config_path)

# get path
dir = os.path.join(cfg.paths.save_dir, "calib_state")
if not os.path.exists(dir):
    os.makedirs(dir)

# params
exposure_time = 100000
leds_intensity = 0.7
subdir = os.path.join(dir, str(exposure_time) + "_" + str(leds_intensity))
os.makedirs(subdir, exist_ok=True)

# turn leds on
subprocess.call(
    "python " + os.path.join(script_dir, "leds_on.py --int " + str(leds_intensity)),
    shell=True,
)

# capture images
fe = frame_extractor()
fe.start_cams(exposure_time=exposure_time)
images = fe.grab_multiple_cams()

# if init, save images
if init:
    for i, image in enumerate(images):
        filepath = os.path.join(subdir, str(i).zfill(2) + ".png")
        image.save(filepath)

# otherwise, compare images
else:
    # load saved images
    saved_images = []
    for i in range(len(images)):
        filepath = os.path.join(subdir, str(i).zfill(2) + ".png")
        saved_images.append(Image(path=filepath))

    # make difference
    for i, image in enumerate(images):
        saved_image = saved_images[i]
        img = np.abs(image.img - saved_image.img)
        new_image = Image(img=img)
        saved_image.show(img_name="saved_" + str(i).zfill(2), wk=1)
        image.show(img_name="new_" + str(i).zfill(2), wk=1)
        new_image.show(img_name="diff_" + str(i).zfill(2), wk=1)

# turn leds on
subprocess.call(
    "python " + os.path.join(script_dir, "leds_off.py"),
    shell=True,
)
cv2.waitKey(0)
