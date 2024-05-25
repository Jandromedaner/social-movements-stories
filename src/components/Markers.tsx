import React from "react";
import { Vector3 } from "three";

interface MarkerProps {
  position: Vector3;
  userData: any;
  onClick: (data: any) => void;
}

const Marker: React.FC<MarkerProps> = ({ position, userData, onClick }) => {
  return (
    <mesh position={position} onClick={() => onClick(userData)}>
      <sphereGeometry args={[0.05, 32, 32]} />
      <meshBasicMaterial color="red" />
    </mesh>
  );
};

const markersData = [
  { position: new Vector3(1, 1, 1), userData: { id: 1, name: "Marker 1" } },
  { position: new Vector3(2, 2, 2), userData: { id: 2, name: "Marker 2" } },
  // Add more marker data as needed...
];

const Markers: React.FC = () => {
  const handleMarkerClick = (data: any) => {
    console.log("Marker clicked:", data);
  };

  return (
    <>
      {markersData.map((marker, index) => (
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
