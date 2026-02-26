import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload } from "@react-three/drei";
import RobotScene from "../scenes/RobotScene";

export default function RobotCanvas() {
  return (
    <Canvas
      className="w-full h-full"
      camera={{
        position: [10, 8, 8],
        fov: 45,
      }}
    >
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />
      <RobotScene />
      <Preload all />
    </Canvas>
  );
}
