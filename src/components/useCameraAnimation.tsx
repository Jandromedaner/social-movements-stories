import { useState } from "react";
import { useThree } from "@react-three/fiber";
import { gsap } from "gsap";

export function useCameraAnimation() {
  const { camera, gl } = useThree();
  const [isAnimating, setIsAnimating] = useState(false);

  const startAnimation = (targetPosition, duration = 2) => {
    setIsAnimating(true);
    gsap.to(camera.position, {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      duration: duration,
      ease: "power2.inOut",
      onUpdate: () => {
        camera.lookAt(0, 0, 0);
        if (gl.orbitControls) {
          gl.orbitControls.update();
        }
      },
      onComplete: () => {
        setIsAnimating(false);
      },
    });
  };

  return { isAnimating, startAnimation };
}
