import os
from utils_ema.config_utils import load_yaml
from utils_ema.light_control import LightController
from utils_ema.basler_utils import frame_extractor
from utils_ema.image import Image

src_dir = os.path.abspath(os.path.dirname(__file__))

led_yaml = os.path.join(src_dir,"..","configs","leds.yaml")

led_cfg = load_yaml(led_yaml)

lc = LightController(led_cfg.ip_controller)
fe = frame_extractor()

fe.start_cams(exposure_time=30000)

gain = 0.7
led_intensity = 0.2
for led in led_cfg.leds.values():
    lc.led_on( led.channel, amp=led_intensity)

while True:
    images = fe.grab_multiple_cams()
    for img in images:
        img.img *= gain
    k = Image.show_multiple_images(images, wk=1)
    if k == ord("q"):
        break

for led in led_cfg.leds.values():
    lc.led_off( led.channel )
