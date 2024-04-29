// pages/index.js
import dynamic from "next/dynamic";
import React from "react";

const ThreeSceneWithNoSSR = dynamic(() => import("../components/ThreeScene"), {
  ssr: false,
});

function HomePage() {
  return (
    <div>
      <ThreeSceneWithNoSSR />
    </div>
  );
}

export default HomePage;
