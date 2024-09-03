import { OrbitControls } from "@react-three/drei";
import { extend } from "@react-three/fiber";
extend({ OrbitControls });

interface OrbitControlsComponentProps {
  isAnimating?: boolean;
  enablePan?: boolean;
  enableZoom?: boolean;
}

const OrbitControlsComponent: React.FC<OrbitControlsComponentProps> = ({
  isAnimating = false,
  enablePan = false,
  enableZoom = false,
}) => {
  // The enablePan prop can be passed to the component to control panning.
  // By default, it's set to false to disable panning.
  return (
    <OrbitControls
      enabled={!isAnimating}
      enablePan={enablePan}
      enableZoom={enableZoom}
      enableRotate={!isAnimating}
    />
  );
};

export default OrbitControlsComponent;
