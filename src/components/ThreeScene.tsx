"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { Canvas } from "@react-three/fiber";
import Background from "./Background";
import Earth from "./Earth";
import Lights from "./Lights";
import OrbitControlsComponent from "./OrbitControlsComponent";
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
  const [showLanding, setShowLanding] = useState(true);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(
    null,
  );

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
    setSelectedMilestone({
      title,
      description: content,
      coordinates: { lat, lng: lon },
    });
    setShowPopup(true);
  };

  const handleMilestoneClick = useCallback((milestone: Milestone) => {
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
    <div className="relative h-screen overflow-hidden">
      <header className="absolute top-0 left-0 w-full z-20 p-4">
        <nav className="flex justify-between items-center">
          <Link legacyBehavior href="/about" passHref>
            <a className="text-white hover:text-blue-200">About</a>
          </Link>
          <Link legacyBehavior href="/contact" passHref>
            <a className="text-white hover:text-blue-200">Contact</a>
          </Link>
        </nav>
      </header>

      <div className="relative w-full h-full">
        {showLanding && (
          <div className="absolute inset-0 z-10">
            <LandingPage onExplore={handleExplore} />
          </div>
        )}

        <Analytics />

        {!showLanding && (
          <div className="relative w-full h-full">
            <Canvas
              camera={{ position: [0, 0, 5], fov: 50 }}
              className="absolute inset-0 z-0"
              style={{ touchAction: "auto" }}
            >
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
              <Background />
              <Starfield />
            </Canvas>
            <CivilRightsMilestones onMilestoneClick={handleMilestoneClick} />
          </div>
        )}

        {selectedMilestone && showPopup && (
          <Popup
            isVisible={showPopup}
            onClose={handleClosePopup}
            title={selectedMilestone.title}
            content={selectedMilestone.description}
          />
        )}
        {/* <h3 className="text-lg font-bold text-gray-800 mb-2">
              {selectedMilestone.title}
            </h3>
            <p className="text-gray-600">{selectedMilestone.description}</p> */}
      </div>
    </div>
  );
};

export default ThreeScene;
