import os, sys

script_dir = os.path.dirname(os.path.realpath(__file__))
sys.path.append(os.path.join(script_dir,"src"))
from load_from_blender import load_from_blender
from load_from_calib import load_from_calib



class SceneLoader():

    @staticmethod
    def load_from_calib(cfg_calib):
        scene = load_from_calib(cfg_calib)
        return scene

    @staticmethod
    def load_from_blender():
        pass
