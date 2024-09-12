import os
from utils_ema.config_utils import load_yaml
from utils_ema.light_control import LightController
from utils_ema.basler_utils import frame_extractor
from utils_ema.image import Image

src_dir = os.path.abspath(os.path.dirname(__file__))

led_yaml = os.path.join(src_dir, "..", "configs", "leds.yaml")
data_dir = os.path.join(src_dir, "..", "data", "last_seen")
if not os.path.exists(data_dir):
    os.makedirs(data_dir)

try:
    led_cfg = load_yaml(led_yaml)
    lc = LightController(led_cfg.ip_controller)
    for led in led_cfg.leds.values():
        lc.led_off(led.channel)
except:
    pass
