// CameraControl.js
import React, { useEffect, useState } from "react";
import { useThree } from "@react-three/fiber";
import { gsap } from "gsap";
import { OrbitControls } from "@react-three/drei";
import { PerspectiveCamera } from "three";

interface CamerControlProps {
  fov: number;
  targetPosition: { x: number; y: number; z: number } | null;
  isAnimating: boolean;
  setIsAnimating: React.Dispatch<React.SetStateAction<boolean>>;
}

const CameraControl: React.FC<CamerControlProps> = ({
  fov,
  targetPosition,
  isAnimating,
  setIsAnimating,
}) => {
  const { camera, gl } = useThree();

  useEffect(() => {
    if ((camera as PerspectiveCamera).isPerspectiveCamera) {
      (camera as PerspectiveCamera).fov = fov;
      camera.updateProjectionMatrix();
    }

    if (targetPosition && isAnimating) {
      console.log("Starting Animation to:", targetPosition);
      setIsAnimating(true);
      gsap.to(camera.position, {
        x: targetPosition.x,
        y: targetPosition.y,
        z: targetPosition.z,
        duration: 2,
        ease: "power2.inOut",
        onStart: () => {
          console.log("Animation started");
          setIsAnimating(true);
        },
        onUpdate: () => {
          camera.lookAt(0, 0, 0);
          if (gl.orbitControls) {
            gl.orbitControls.update();
          }
        },
        onComplete: () => {
          console.log("Animation Complete");
          setIsAnimating(false);
        },
      });
    }
  }, [camera, targetPosition, fov, isAnimating, setIsAnimating, gl]);

  return (
    <OrbitControls
      enableZoom={false}
      enablePan={false}
      enableRotate={!isAnimating}
    />
  );
};

export default CameraControl;
