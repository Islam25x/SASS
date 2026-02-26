import AnimatedCameraRig from "./AnimatedCameraRig";
import RobotModel from "../models/RobotModel";

const RobotScene = () => {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <hemisphereLight intensity={0.5} groundColor="black" />
      <AnimatedCameraRig />
      <RobotModel />
    </>
  );
};

export default RobotScene;
