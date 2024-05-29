// Lights.js
import React from "react";

const Lights: React.FC = () => {
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 3, 5]} intensity={1.5} />
      <hemisphereLight groundColor={0x080820} intensity={1} />
    </>
  );
};

export default Lights;
