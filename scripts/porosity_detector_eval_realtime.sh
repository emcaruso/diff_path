SCRIPTPATH="$(
  cd -- "$(dirname "$0")" >/dev/null 2>&1
  pwd -P
)"

rm -rf ./wandb
python3 $SCRIPTPATH/../src/PorosityDetector/src/main.py --config_path $SCRIPTPATH/../configs/porosity_detector.yaml --mode eval_realtime
