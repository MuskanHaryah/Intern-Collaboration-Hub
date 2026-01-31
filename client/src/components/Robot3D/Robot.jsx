import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export function Robot({ mousePosition }) {
  const groupRef = useRef();
  const headRef = useRef();
  
  // Load the robot model
  const { scene } = useGLTF('/models/robot.glb');

  // Find head bone/mesh on load
  scene.traverse((child) => {
    if (child.name.toLowerCase().includes('head') && !headRef.current) {
      headRef.current = child;
    }
  });

  // Animate robot to follow cursor
  useFrame((state) => {
    if (groupRef.current) {
      // Subtle body rotation following cursor
      const targetRotationY = (mousePosition.x - 0.5) * 0.5;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotationY,
        0.05
      );

      // Gentle floating animation
      groupRef.current.position.y = -1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }

    if (headRef.current) {
      // Head follows cursor more dramatically
      const targetHeadY = (mousePosition.x - 0.5) * Math.PI * 0.3;
      const targetHeadX = (mousePosition.y - 0.5) * Math.PI * 0.15;

      headRef.current.rotation.y = THREE.MathUtils.lerp(
        headRef.current.rotation.y,
        targetHeadY,
        0.1
      );
      headRef.current.rotation.x = THREE.MathUtils.lerp(
        headRef.current.rotation.x,
        targetHeadX,
        0.1
      );
    }
  });

  return (
    <group ref={groupRef} position={[0, -1, 0]} scale={1.5}>
      <primitive object={scene} />
    </group>
  );
}

// Preload for better performance
useGLTF.preload('/models/robot.glb');
