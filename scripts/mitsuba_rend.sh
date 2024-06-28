SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

python3 $SCRIPTPATH/../src/MitsubaRenderer/src/solver.py --config_path $SCRIPTPATH/../configs/mitsuba_rend.yaml
