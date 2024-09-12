SCRIPTPATH="$(
  cd -- "$(dirname "$0")" >/dev/null 2>&1
  pwd -P
)"

sh $SCRIPTPATH/leds_on.sh
python3 $SCRIPTPATH/../src/EdgedPoseEstim/src/main.py --config_path $SCRIPTPATH/../configs/edged_pose_estim_conv.yaml
sh $SCRIPTPATH/leds_off.sh
