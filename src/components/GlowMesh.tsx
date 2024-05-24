import React, { useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import {
  Mesh,
  ShaderMaterial,
  Color,
  AdditiveBlending,
  FrontSide,
} from "three";

const GlowMesh = () => {
  const { camera } = useThree();
  const meshRef = useRef<Mesh>(null);
  const material = new ShaderMaterial({
    uniforms: {
      // color1: { value: new THREE.Color(0x67b8ff) },
      // color2: { value: new THREE.Color(0x000000) },
      fresnelBias: { value: 0.1 },
      fresnelScale: { value: 0.5 },
      fresnelPower: { value: 2.0 },
      viewVector: { value: camera.position },
      glowColor: { value: new Color(0x00aaff) },
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
            uniform vec3 glowColor;
            varying float vReflectionFactor;
            void main() {
                gl_FragColor = vec4(glowColor, 1.0) * vReflectionFactor;
            }
        `,
    blending: AdditiveBlending,
    side: FrontSide,
    depthTest: false,
    transparent: true,
  });

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh scale={[2, 2, 2]}>
      <sphereGeometry args={[1.03, 32, 32]} />{" "}
      {/* Slightly larger than the Earth */}
      <primitive attach="material" object={material} />
    </mesh>
  );
};

export default GlowMesh;
