"use client";

import React, { useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import Background from "./Background";
import Earth from "./Earth";
import Markers from "./Markers";
import Lights from "./Lights";
import OrbitControlsComponent from "./OrbitControlsComponent";
import GlowMesh from "./GlowMesh";
import Starfield from "./Starfield";
import NavigationMenu from "./NavigationMenu";
import CameraControl from "./CameraControl";

const ThreeScene = () => {
  const [targetPosition, setTargetPosition] = useState(null);

  const handleCameraMove = (lat, lon, alt) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -alt * Math.sin(phi) * Math.cos(theta);
    const y = alt * Math.cos(phi);
    const z = alt * Math.sin(phi) * Math.sin(theta);
    setTargetPosition({ x, y, z });
  };

  return (
    <div className="three-scene">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <OrbitControlsComponent />
        <Lights />
        <Earth />
        <CameraControl fov={50} targetPosition={targetPosition} />
        {/* <Markers /> */}
        <Background />
        {/* <GlowMesh /> */}
        <Starfield />
        {/* <NavigationMenu onNavigate={handleNavigate} /> */}
      </Canvas>
      {/* <NavigationMenu onNavigate={handleCameraMove} /> */}
      <button onClick={() => handleCameraMove(44.2601, -72.5754, 5)}>
        Go to Peace of Paris 1783
      </button>
    </div>
  );
};

export default ThreeScene;
