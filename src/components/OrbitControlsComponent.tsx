import { OrbitControls } from "@react-three/drei";

const OrbitControlsComponent = ({
  enablePan = false,
  enableZoom = false,
  enableRotate = true,
}) => {
  // The enablePan prop can be passed to the component to control panning.
  // By default, it's set to false to disable panning.
  return (
    <OrbitControls
      enablePan={enablePan}
      enableZoom={enableZoom}
      enableRotate={enableRotate}
    />
  );
};

export default OrbitControlsComponent;
