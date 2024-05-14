import React, { useRef } from "react";
import { useThree, extend, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const GlowMesh = () => {
  const { camera } = useThree();
  const meshRef = useRef();
  const material = new THREE.ShaderMaterial({
    uniforms: {
      color1: { value: new THREE.Color(0x67b8ff) },
      color2: { value: new THREE.Color(0x000000) },
      fresnelBias: { value: 0.1 },
      fresnelScale: { value: 1.0 },
      fresnelPower: { value: 4.0 },
      viewVector: { value: camera.position },
    },
    vertexShader: `
            uniform vec3 viewVector;
            uniform float fresnelBias;
            uniform float fresnelScale;
            uniform float fresnelPower;
            varying float vReflectionFactor;
            void main() {
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                vec3 vNormal = normalize(normalMatrix * normal);
                vec3 vViewPosition = normalize(-mvPosition.xyz);

                vReflectionFactor = fresnelBias + fresnelScale * pow(1.0 + dot(vNormal, vViewPosition), fresnelPower);
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }
        `,
    fragmentShader: `
            uniform vec3 color1;
            uniform vec3 color2;
            varying float vReflectionFactor;
            void main() {
                gl_FragColor = vec4(mix(color2, color1, vReflectionFactor), 1.0);
            }
        `,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    transparent: true,
  });

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh>
      <sphereGeometry args={[1.1, 64, 64]} />{" "}
      {/* Slightly larger than the Earth */}
      <primitive attach="material" object={material} />
    </mesh>
  );
};

export default GlowMesh;
