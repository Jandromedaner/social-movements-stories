// CameraControl.js
import React, { useEffect, useState } from "react";
import { useThree } from "@react-three/fiber";
import { gsap } from "gsap";
import { OrbitControls } from "@react-three/drei";
import { useCameraAnimation } from "./useCameraAnimation";

const CameraControl = ({ fov, targetPosition }) => {
  const { camera, gl } = useThree();
  const { isAnimating, startAnimation } = useCameraAnimation();

  useEffect(() => {
    // camera.fov = fov;
    camera.updateProjectionMatrix();

    if (targetPosition) {
      startAnimation(targetPosition);
    }
  }, [targetPosition, startAnimation]);

  return (
    <OrbitControls
      enabled={!isAnimating}
      enableZoom={false} // No zoom
      enablePan={false} // No pan
      enableRotate={true}
    />
  );
};

export default CameraControl;
