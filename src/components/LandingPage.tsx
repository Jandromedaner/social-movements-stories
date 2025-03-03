"use client";
import React from "react";
import { Globe } from "lucide-react";
import Background from "./Background";

const LandingPage: React.FC = ({ onExplore }) => {
  return (
    <div className="h-screen flex flex-col justify-center items-center text-white">
      {/* <Background className="absolute inset-0 z-0" /> */}
      {/* <nav className="flex justify-between items-center p-4">
        <Link legacyBehavior href="/about" passHref>
          <a className="text-white hover:text-blue-200">About</a>
        </Link>
        <div className="flex items-center">
          <Globe className="mr-2" size={24} />
          <span className="text-xl font-bold">CivilRightsMilestones</span>
        </div>
        <Link legacyBehavior href="/contact" passHref>
          <a className="text-white hover:text-blue-200">Contact</a>
        </Link>
      </nav> */}

      <main className="flex-grow flex flex-col items-center justify-center text-center">
        <h1 className="text-5xl font-bold mb-4">Civil Rights Milestones</h1>
        <p className="text-xl mb-8">
          Key Moments of civil rights on a global scale
        </p>
        <button
          onClick={onExplore}
          className="bg-white text-blue-600 hover:bg-blue-100 transition-colors px-6 py-3 rounded-full font-semibold"
        >
          Explore the Globe
        </button>
      </main>
    </div>
  );
};

export default LandingPage;
