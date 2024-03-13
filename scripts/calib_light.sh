SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

python3 $SCRIPTPATH/../src/LightCalib/src/main.py --config_path $SCRIPTPATH/../configs/light_calib.yaml
