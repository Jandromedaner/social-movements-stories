// CameraControl.js
import React, { useEffect, useState } from "react";
import { useThree } from "@react-three/fiber";
import { gsap } from "gsap";
import { OrbitControls } from "@react-three/drei";

const CameraControl = ({
  isAnimating,
  setIsAnimating,
  fov,
  targetPosition,
}) => {
  const { camera, gl } = useThree();

  useEffect(() => {
    camera.fov = fov;
    camera.updateProjectionMatrix();

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
