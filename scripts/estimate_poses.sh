SCRIPTPATH="$(
  cd -- "$(dirname "$0")" >/dev/null 2>&1
  pwd -P
)"

python3 $SCRIPTPATH/../src/ConveyorPoseEstimator/src/estimate_poses.py --config_path $SCRIPTPATH/../configs/pose_estimator.yaml
