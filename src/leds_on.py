import os
from utils_ema.config_utils import load_yaml
from utils_ema.light_control import LightController
from utils_ema.basler_utils import frame_extractor
from utils_ema.image import Image
import argparse


try:
    # get intensity from command line
    parser = argparse.ArgumentParser(description="Control LED intensity")
    parser.add_argument(
        "--int",
        help="the intensity of the LED",
        nargs="?",
        type=float,
        const=1,
        default=1,
    )
    args = parser.parse_args()
    led_intensity = args.int
    led_intensity = max(0, min(1, led_intensity))

    # Turn on LEDs
    src_dir = os.path.abspath(os.path.dirname(__file__))
    led_yaml = os.path.join(src_dir, "..", "configs", "leds.yaml")
    data_dir = os.path.join(src_dir, "..", "data", "last_seen")
    if not os.path.exists(data_dir):
        os.makedirs(data_dir)
    led_cfg = load_yaml(led_yaml)
    lc = LightController(led_cfg.ip_controller)
    for led in led_cfg.leds.values():
        lc.led_on(led.channel, amp=led_intensity)
except:
    pass
