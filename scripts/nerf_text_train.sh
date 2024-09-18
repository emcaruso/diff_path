SCRIPTPATH="$(
  cd -- "$(dirname "$0")" >/dev/null 2>&1
  pwd -P
)"

python3 $SCRIPTPATH/../src/NerfText/src/main.py --config_path $SCRIPTPATH/../configs/nerf_text.yaml --mode train
