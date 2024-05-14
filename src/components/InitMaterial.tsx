import * as THREE from "three";

const initMaterial = () => {
  const uniforms = {
    color1: { value: new THREE.Color(0x67b8ff) },
    color2: { value: new THREE.Color(0x000000) },
    fresnelBias: { value: 0.1 },
    fresnelScale: { value: 1.0 },
    fresnelPower: { value: 4.0 },
    // Ensure the camera's position is defined if it's used in the shader
    viewVector: { value: new THREE.Vector3() },
  };

  const vertexShader = `...`; // Your vertex shader code
  const fragmentShader = `...`; // Your fragment shader code

  return new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    transparent: true,
    blending: THREE.AdditiveBlending,
  });
};

export default initMaterial;
