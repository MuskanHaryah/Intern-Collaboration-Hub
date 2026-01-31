import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { useMousePosition } from '../../hooks/useMousePosition';
import { SimpleRobot } from './SimpleRobot';

// Loading component
function Loader() {
  return (
    <mesh>
      <octahedronGeometry args={[0.3, 0]} />
      <meshStandardMaterial color="#ffffff" wireframe />
    </mesh>
  );
}

export function RobotScene() {
  const mousePosition = useMousePosition();

  return (
    <div 
      className="absolute right-0 top-0 w-full md:w-[55%] h-screen"
      style={{ pointerEvents: 'none' }}
    >
      <Canvas
        camera={{ position: [0, 1, 6], fov: 45 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={<Loader />}>
          {/* Very subtle ambient */}
          <ambientLight intensity={0.15} />
          
          {/* Main key light - top right, white */}
          <spotLight
            position={[5, 8, 5]}
            angle={0.4}
            penumbra={1}
            intensity={1.2}
            color="#ffffff"
          />
          
          {/* Soft fill from left */}
          <pointLight position={[-4, 2, 2]} color="#ffffff" intensity={0.3} />
          
          {/* Subtle rim light from behind */}
          <pointLight position={[0, 2, -4]} color="#ffffff" intensity={0.2} />

          {/* Robot with built-in cursor spotlight */}
          <SimpleRobot mousePosition={mousePosition} />

          {/* HDR environment for chrome reflections */}
          <Environment preset="studio" />
        </Suspense>
      </Canvas>
    </div>
  );
}
