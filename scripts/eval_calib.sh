SCRIPTPATH="$(
  cd -- "$(dirname "$0")" >/dev/null 2>&1
  pwd -P
)"

python3 $SCRIPTPATH/../src/eval_calib.py
