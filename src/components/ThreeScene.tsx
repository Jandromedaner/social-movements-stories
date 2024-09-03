"use client";

import React, { useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import Background from "./Background";
import Earth from "./Earth";
import Lights from "./Lights";
import OrbitControlsComponent from "./OrbitControlsComponent";
// import GlowMesh from "./GlowMesh";
import Clouds from "./Clouds";
import Starfield from "./Starfield";
import CameraControl from "./CameraControl";
import Popup from "./Popup";
import CivilRightsMilestones from "./CivilRightsMilestones";
import { Analytics } from "@vercel/analytics/react";
import LandingPage from "./LandingPage";

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
  const [showLanding, setShowLanding] = useState(true);
  const [selectedMilestone, setSelectedMilestone] = useState(null);

  const handleExplore = useCallback(() => {
    setShowLanding(false);
  }, []);

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

  const handleMilestoneClick = useCallback((milestone) => {
    setSelectedMilestone(milestone);
    console.log("Milestone clicked:", milestone.title);
    handleCameraMove(
      milestone.coordinates.lat,
      milestone.coordinates.lng,
      5, // Adjust altitude as needed
      milestone.title,
      milestone.description,
    );
  }, []);

  return (
    // <div className="three-scene">
    <div className="relative w-full h-screen">
      {showLanding && (
        <div className="absolute inset-0 z-10">
          <LandingPage onExplore={handleExplore} />
        </div>
      )}

      <Analytics />
      <Popup
        isVisible={showPopup}
        onClose={handleClosePopup}
        title={popupTitle}
        content={popupContent}
      />

      {selectedMilestone && (
        <div className="absolute top-4 right-4 z-20 p-4 bg-white rounded-lg shadow-lg max-w-sm">
          <button
            onClick={handleClosePopup}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            X
          </button>
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            {selectedMilestone.title}
          </h3>
          <p className="text-gray-600">{selectedMilestone.description}</p>
        </div>
      )}

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
    </div>
  );
};

export default ThreeScene;
