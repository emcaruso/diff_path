from data_collector import DataCollector

from trainer import Trainer
from evaluator import Evaluator
import argparse
from utils_ema.config_utils import load_yaml
import os

script_dir = os.path.abspath(os.path.dirname(__file__))
cfg_path = os.path.join(script_dir, "..", "..", "configs", "collector.yaml")

import rootutils

rootutils.setup_root(__file__, indicator="main.py", pythonpath=True)


class Program:

    def __init__(self, opt):
        self.cfg_path = opt.config_path
        self.cfg = load_yaml(self.cfg_path)
        self.mode = opt.mode

    def collect(self):
        dc = DataCollector(self.cfg)
        dc.collect_data()

    def collect_realtime(self):
        self.cfg.collect.eval_realtime = self.cfg.collect.eval
        self.cfg.collect.eval_realtime.subfolder = "eval_realtime"
        dc = DataCollector(self.cfg)
        dc.collect_data_realtime()

    def train(self):
        trainer = Trainer(self.cfg)
        trainer.train()
        pass

    def evaluate(self):
        Evaluator(self.cfg).evaluate()

    def evaluate_realtime(self):
        self.cfg.collect.eval_realtime = self.cfg.collect.eval
        self.cfg.collect.eval_realtime.subfolder = "eval_realtime"
        Evaluator(self.cfg).evaluate_realtime()

    def run(self):
        if self.mode == "collect_realtime":
            self.collect_realtime()
        elif self.mode == "collect":
            self.collect()
        elif self.mode == "train":
            self.train()
        elif self.mode == "eval":
            self.evaluate()
        elif self.mode == "eval_realtime":
            self.evaluate_realtime()
        else:
            raise ValueError("Invalid mode")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--config_path", default=cfg_path)
    parser.add_argument("--mode", default="collect")
    opt = parser.parse_args()

    p = Program(opt)
    p.run()
