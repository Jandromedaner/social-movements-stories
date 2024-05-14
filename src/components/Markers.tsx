// Markers.tsx
import React from "react";

const Marker = ({ position, userData, onClick }) => {
  return (
    <mesh position={position} onClick={() => onClick(userData)}>
      <sphereGeometry args={[0.05, 32, 32]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
};

const Markers = () => {
  const markers = [
    { position: [1, 1, 1], userData: { title: "Marker 1" } },
    { position: [-1, -1, 1], userData: { title: "Marker 2" } },
  ];

  const handleMarkerClick = (userData) => {
    console.log("Marker clicked:", userData);
  };

  return (
    <>
      {markers.map((marker, index) => (
        <Marker
          key={index}
          position={marker.position}
          userData={marker.userData}
          onClick={handleMarkerClick}
        />
      ))}
    </>
  );
};

export default Markers;
