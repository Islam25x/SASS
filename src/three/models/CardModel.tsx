import { useGLTF } from "@react-three/drei";
import { useRef } from "react";
import type { Mesh } from "three";
import { useCardRotation } from "../hooks/useCardRotation";

const CardModel = () => {
  const { scene } = useGLTF("3D/card/scene.gltf");
  const cardRef = useRef<Mesh>(null);
  useCardRotation(cardRef);

  return (
    <mesh ref={cardRef}>
      <primitive object={scene} scale={0.03} position={[0, 0, 0]} />
    </mesh>
  );
};

export default CardModel;
