import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";

const Background = () => {
  const { scene } = useThree(); // Access the three.js scene from R3F

  useEffect(() => {
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
      "/img/px_eso0932a.jpeg",
      "/img/nx_eso0932a.jpeg",
      "/img/py_eso0932a.jpeg",
      "/img/ny_eso0932a.jpeg",
      "/img/pz_eso0932a.jpeg",
      "/img/nz_eso0932a.jpeg",
    ]);
    scene.background = texture; // Set the scene background to the loaded texture

    // Clean up
    return () => {
      scene.background = null;
    };
  }, [scene]); // Dependency array to avoid unnecessary re-executions

  return null; // This component does not render anything
};

export default Background;
