// pages/index.js
import dynamic from "next/dynamic";
import React from "react";

const ThreeCanvas = dynamic(() => import("../components/ThreeScene"), {
  ssr: false,
});

function HomePage() {
  return (
    <div>
      <ThreeCanvas />
    </div>
  );
}

export default HomePage;
