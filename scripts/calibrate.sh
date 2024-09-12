# path to the script
SCRIPTPATH="$(
  cd -- "$(dirname "$0")" >/dev/null 2>&1
  pwd -P
)"

# # activate or create venv
# if [ -d "$SCRIPTPATH/../src/Calibration/env/venv" ]; then
#   echo "Environment found. Activating..."
#   . $SCRIPTPATH/../src/Calibration/env/venv/bin/activate
# else
#   echo "Environment not found. Creating a new one..."
#   virtualenv -p python3.10 $SCRIPTPATH/../src/Calibration/env/venv
#   . $SCRIPTPATH/../src/Calibration/env/venv/bin/activate
#   pip install -r $SCRIPTPATH/../src/Calibration/env/requirements.txt
# fi
#
# recreate always
#virtualenv -p python3.10 $SCRIPTPATH/../src/Calibration/env/venv
#. $SCRIPTPATH/../src/Calibration/env/venv/bin/activate
#pip install -r $SCRIPTPATH/../src/Calibration/env/requirements.txt

sh $SCRIPTPATH/leds_on.sh
python3 $SCRIPTPATH/../src/Calibration/src/main.py --config_path $SCRIPTPATH/../configs/calibration.yaml
sh $SCRIPTPATH/leds_off.sh
python3 $SCRIPTPATH/../src/Calibration/src/conveyor_preprocess.py --config_path $SCRIPTPATH/../configs/calibration.yaml
python3 $SCRIPTPATH/../src/Calibration/src/main.py --config_path $SCRIPTPATH/../configs/calibration.yaml --conv_boards
# python3 $SCRIPTPATH/../src/eval_calib.py --init
