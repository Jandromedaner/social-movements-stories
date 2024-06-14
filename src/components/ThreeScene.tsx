"use client";

import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import Background from "./Background";
import Earth from "./Earth";
import Lights from "./Lights";
import OrbitControlsComponent from "./OrbitControlsComponent";
import GlowMesh from "./GlowMesh";
import Clouds from "./Clouds";
import Starfield from "./Starfield";
import CameraControl from "./CameraControl";
import Popup from "./Popup";
import CivilRightsMilestones from "./CivilRightsMilestones";

interface TargetPosition {
  x: number;
  y: number;
  z: number;
}

interface Milestone {
  title: string;
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

const ThreeScene: React.FC = () => {
  const [targetPosition, setTargetPosition] = useState<TargetPosition | null>(
    null,
  );
  const [showPopup, setShowPopup] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupContent, setPopupContent] = useState("");

  const handleClosePopup = () => {
    setShowPopup(false);
    if (isAnimating && showPopup) {
      setIsAnimating(false);
    }
  };

  const handleCameraMove = (
    lat: number,
    lon: number,
    alt: number,
    title: string,
    content: string,
  ) => {
    console.log("Camera move initiated");
    setIsAnimating(true);
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -alt * Math.sin(phi) * Math.cos(theta);
    const y = alt * Math.cos(phi);
    const z = alt * Math.sin(phi) * Math.sin(theta);
    setTargetPosition({ x, y, z });
    setPopupTitle(title);
    setPopupContent(content);
    setShowPopup(true);
  };

  const handleMilestoneClick = (milestone: Milestone) => {
    console.log("Milestone clicked:", milestone.title);
    handleCameraMove(
      milestone.coordinates.lat,
      milestone.coordinates.lng,
      5, // Adjust altitude as needed
      milestone.title,
      milestone.description,
    );
  };

  return (
    <div className="three-scene">
      <Popup
        isVisible={showPopup}
        onClose={handleClosePopup}
        title={popupTitle}
        content={popupContent}
      />
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <OrbitControlsComponent isAnimating={isAnimating} />
        <Lights />
        <Earth />
        <Clouds />
        <CameraControl
          fov={50}
          targetPosition={targetPosition}
          isAnimating={isAnimating}
          setIsAnimating={setIsAnimating}
        />
        {/* <Markers /> */}
        <Background />
        {/* <GlowMesh /> */}
        <Starfield />
        {/* <NavigationMenu onNavigate={handleNavigate} /> */}
      </Canvas>
      {/* <NavigationMenu onNavigate={handleCameraMove} /> */}
      {/* <button onClick={() => handleCameraMove(44.2601, -72.5754, 5)}>
        Go to Civil Rights Movement in the United States:
      </button> */}
      <CivilRightsMilestones onMilestoneClick={handleMilestoneClick} />
    </div>
  );
};

export default ThreeScene;
