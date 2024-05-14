import React from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

const Starfield = () => {
  const texture = useLoader(THREE.TextureLoader, "/img/stars/circle.png");
  const starsGeometry = new THREE.BufferGeometry();
  const starsMaterials = [];

  const starCount = 10000;
  const positions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 2000;
    positions[i3 + 1] = (Math.random() - 0.5) * 2000;
    positions[i3 + 2] = (Math.random() - 0.5) * 2000;

    const color = new THREE.Color(0xffffff);
    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;
  }

  starsGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3),
  );
  starsGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const starsMaterial = new THREE.PointsMaterial({
    size: 1,
    sizeAttenuation: true,
    map: texture,
    alphaTest: 0.5,
    transparent: true,
    vertexColors: true,
  });

  return <points geometry={starsGeometry} material={starsMaterial} />;
};

export default Starfield;
