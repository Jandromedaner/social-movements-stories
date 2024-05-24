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
import Popup from "./Popup";
import CivilRightsMilestones from "./CivilRightsMilestones";

const ThreeScene = () => {
  const [targetPosition, setTargetPosition] = useState(null);
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

  const handleCameraMove = (lat, lon, alt, title, content) => {
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

  const handleMilestoneClick = (milestone) => {
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
