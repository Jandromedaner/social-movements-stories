import React, { useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

const Earth: React.FC = ({ selectedMilestone }) => {
  const texturesLoaded = useLoader(THREE.TextureLoader, [
    "/img/00_earthmap8k.jpg",
    "/img/01_earthbump1k.jpg",
    "/img/02_earthspec1k.jpg",
    "/img/03_earthlights8k.jpg",
    "/img/EARTH_DISPLACE_42K_16BITS_preview.jpg",
  ]);

  const milestonePosition = useMemo(() => {
    if (selectedMilestone) {
      // Convert milestone's lat/long to 3D position
      // This is a placeholder calculation and should be replaced with actual conversion
      const lat = selectedMilestone.latitude * (Math.PI / 180);
      const long = selectedMilestone.longitude * (Math.PI / 180);
      const x = Math.cos(lat) * Math.sin(long);
      const y = Math.sin(lat);
      const z = Math.cos(lat) * Math.cos(long);
      return [x, y, z];
    }
    return null;
  }, [selectedMilestone]);

  const materialProps = useMemo(() => {
    return {
      map: texturesLoaded[0],
      bumpMap: texturesLoaded[1],
      bumpScale: 0.5,
      // specularMap: texturesLoaded[2],
      roughness: 0.5,
      metalness: 0.1,
      emissiveMap: texturesLoaded[3],
      emissive: new THREE.Color(0x222222),
      emissiveIntensity: 1,
      displacementMap: texturesLoaded[4],
      displacementScale: 0.05,
    };
  }, [texturesLoaded]);

  const uniforms = useMemo(
    () => ({
      color: { value: new THREE.Color(0xff0000) },
      time: { value: 0 },
    }),
    [],
  );

  return (
    <group>
      <mesh scale={[2, 2, 2]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
      {milestonePosition && (
        <mesh position={milestonePosition}>
          <sphereGeometry args={[0.02, 16, 16]} />
          <meshBasicMaterial color="red" />
        </mesh>
      )}
    </group>
  );
};

export default Earth;
