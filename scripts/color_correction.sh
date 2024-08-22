SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

python3 $SCRIPTPATH/../src/ColorCorrection/src/main.py --config_path $SCRIPTPATH/../configs/color_correction.yaml
