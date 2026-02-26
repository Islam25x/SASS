import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";

export function useAnimatedCamera() {
  const [animationDone, setAnimationDone] = useState(false);
  const startTime = useRef<number | null>(null);

  useFrame((state) => {
    const camera = state.camera;

    if (!animationDone) {
      if (startTime.current === null) {
        startTime.current = state.clock.elapsedTime;
      }
      const elapsed = state.clock.elapsedTime - startTime.current;

      const duration = 1.5;
      let progress = Math.min(elapsed / duration, 1);

      const easeInOutCubic = (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      progress = easeInOutCubic(progress);

      const radius = 10;
      const startAngle = Math.PI / 2.5;
      const endAngle = Math.PI / 6;
      const angle = startAngle - progress * (startAngle - endAngle);

      const startY = 8;
      const endY = 0;
      const y = startY - progress * (startY - endY);

      camera.position.x = Math.cos(angle) * radius;
      camera.position.z = Math.sin(angle) * radius;
      camera.position.y = y;
      camera.lookAt(0, 0, 0);

      if (progress >= 1) {
        setAnimationDone(true);
      }
    }
  });
}
