SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

python3 $SCRIPTPATH/../src/Calibration/src/main.py --config_path $SCRIPTPATH/../configs/calibration.yaml
python3 $SCRIPTPATH/../src/Calibration/src/conveyor_preprocess.py --config_path $SCRIPTPATH/../configs/calibration.yaml
