import React, { useRef } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Clouds = () => {
  const cloudTexture = useLoader(
    THREE.TextureLoader,
    "/img/04_earthcloudmap8k.jpg",
  );
  const cloudTransparency = useLoader(
    THREE.TextureLoader,
    "/img/05_earthcloudmaptrans.jpg",
  );
  const meshRef = useRef();

  useFrame(() => {
    // Rotate the cloud mesh about the y-axis
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.005, 64, 64]} />{" "}
      {/* Slightly larger than the Earth for a cloud layer */}
      <meshPhongMaterial
        map={cloudTexture}
        alphaMap={cloudTransparency}
        transparent={true}
        opacity={0.4}
        depthWrite={false} // Important to prevent cloud layer from affecting the depth buffer
        side={THREE.DoubleSide} // Render both sides of the material
      />
    </mesh>
  );
};

export default Clouds;
