import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows, OrbitControls } from '@react-three/drei';
import { useMousePosition } from '../../hooks/useMousePosition';
import { SimpleRobot } from './SimpleRobot';

// Loading component
function Loader() {
  return (
    <mesh>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#b026ff" wireframe />
    </mesh>
  );
}

export function RobotScene() {
  const mousePosition = useMousePosition();
  const [useCustomModel, setUseCustomModel] = useState(false);
  const [Robot, setRobot] = useState(null);

  // Try to load custom robot model
  useEffect(() => {
    // Check if custom model exists
    fetch('/models/robot.glb', { method: 'HEAD' })
      .then((response) => {
        if (response.ok) {
          // Dynamically import the Robot component
          import('./Robot').then((module) => {
            setRobot(() => module.Robot);
            setUseCustomModel(true);
          });
        }
      })
      .catch(() => {
        // Use fallback SimpleRobot
        setUseCustomModel(false);
      });
  }, []);

  return (
    <div 
      className="absolute right-0 top-0 w-full md:w-1/2 h-screen"
      style={{ pointerEvents: 'none' }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <Suspense fallback={<Loader />}>
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          
          {/* Main spotlight with purple tint */}
          <spotLight
            position={[5, 10, 7]}
            angle={0.3}
            penumbra={1}
            intensity={1}
            color="#b026ff"
            castShadow
          />
          
          {/* Secondary light - pink accent */}
          <pointLight position={[-5, 5, 5]} color="#ff2d95" intensity={0.5} />
          
          {/* Rim light - cyan */}
          <pointLight position={[0, -3, -5]} color="#00d4ff" intensity={0.3} />

          {/* Robot - use custom model if available, otherwise geometric */}
          {useCustomModel && Robot ? (
            <Robot mousePosition={mousePosition} />
          ) : (
            <SimpleRobot mousePosition={mousePosition} />
          )}

          {/* Environment for reflections */}
          <Environment preset="night" />

          {/* Shadow */}
          <ContactShadows
            position={[0, -2, 0]}
            opacity={0.4}
            scale={10}
            blur={2.5}
            far={4}
            color="#b026ff"
          />
        </Suspense>

        {/* Optional: Enable orbit controls for debugging */}
        {/* <OrbitControls enableZoom={false} /> */}
      </Canvas>
    </div>
  );
}
