import os
from utils_ema.config_utils import load_yaml
from utils_ema.light_control import LightController
from collect import Collector

script_dir = os.path.abspath(os.path.dirname(__file__))
led_cfg_path = os.path.join(script_dir, "..", "..", "configs", "leds.yaml")
led_cfg = load_yaml(led_cfg_path)
cfg_path = os.path.join(script_dir, "..", "..", "configs", "collector.yaml")

lc = LightController(ip_controller=led_cfg.ip_controller)

for k, v in led_cfg.leds.items():
    lc.led_on(channel=v.channel, amp=1.0)

c = Collector(cfg_path, led_cfg_path)
c.show_streams()

for k, v in led_cfg.leds.items():
    lc.led_off(channel=v.channel)
