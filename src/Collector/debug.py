from collect import Collector
import argparse
import os

script_dir = os.path.abspath(os.path.dirname(__file__))
cfg_path = os.path.join(script_dir, "..", "..", "configs", "collector.yaml")
led_cfg_path = os.path.join(script_dir, "..", "..", "configs", "leds.yaml")

parser = argparse.ArgumentParser()
parser.add_argument("--config_path", default=cfg_path)
parser.add_argument("--led_config_path", default=led_cfg_path)
opt = parser.parse_args()

collector = Collector(opt.config_path, opt.led_config_path)
collector.collect_while_tracking(manual=False, debug=True)
