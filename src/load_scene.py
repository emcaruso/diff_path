import os, sys

script_dir = os.path.dirname(os.path.realpath(__file__))
sys.path.append(os.path.join(script_dir,"src"))
from LightCalib import load_light_calib_data
from utils_ema.config_utils import load_yaml


def load_scene():
    cfg = load_yaml(os.path.join(script_dir,"..","configs", "light_calib.yaml"))
    lcl = load_light_calib_data.LightCalibLoader(cfg)
    # point_lights = lcl.get_point_lights()
    # scene = lcl.get_scene_only_lights()
    scene = lcl.get_scene()
    return scene

if __name__=="__main__":
    scene = load_scene()
    scene.plot()
