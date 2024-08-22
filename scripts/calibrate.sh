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

# python3 $SCRIPTPATH/../src/Calibration/src/main.py --config_path $SCRIPTPATH/../configs/calibration.yaml
# python3 $SCRIPTPATH/../src/Calibration/src/conveyor_preprocess.py --config_path $SCRIPTPATH/../configs/calibration.yaml

# execute sh script
sh $SCRIPTPATH/eval_calib_set.sh
