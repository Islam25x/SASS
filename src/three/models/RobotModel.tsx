import { useGLTF } from "@react-three/drei";
import { useRef } from "react";

const RobotModel = () => {
  const { scene } = useGLTF("3D/Robot/Meshy_AI_Tesla_Bot_0225233704_texture.glb");
  const robotRef = useRef(null);

  return (
    <primitive
      ref={robotRef}
      object={scene}
      scale={10}
      position={[0, -6, 0]}
      rotation={[0, Math.PI / 6, 0]}
    />
  );
};

export default RobotModel;
