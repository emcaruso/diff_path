ls
SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

# python3 $SCRIPTPATH/../src/ConveyorPoseEstimator/src/render_tables.py --config_path $SCRIPTPATH/../configs/pose_estimator.yaml
python3 $SCRIPTPATH/../src/ConveyorPoseEstimator/src/render_tables.py --config_path $SCRIPTPATH/../configs/pose_estimator_conveyor.yaml
# python3 $SCRIPTPATH/../src/ConveyorPoseEstimator/src/render_tables.py --config_path $SCRIPTPATH/../configs/pose_estimator_base.yaml
