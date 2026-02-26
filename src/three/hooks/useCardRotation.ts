import { useFrame } from "@react-three/fiber";
import type { RefObject } from "react";
import type { Mesh } from "three";

export function useCardRotation(cardRef: RefObject<Mesh | null>) {
  useFrame(() => {
    if (cardRef.current) {
      cardRef.current.rotation.y += 0.01;
      cardRef.current.rotation.x = 0.2;
    }
  });
}
