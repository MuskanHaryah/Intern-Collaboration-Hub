import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Fallback geometric robot when no 3D model is available
export function SimpleRobot({ mousePosition }) {
  const groupRef = useRef();
  const headRef = useRef();
  const leftEyeRef = useRef();
  const rightEyeRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      // Body sway
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        (mousePosition.x - 0.5) * 0.3,
        0.05
      );
      
      // Floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
    }

    if (headRef.current) {
      // Head follows cursor
      headRef.current.rotation.y = THREE.MathUtils.lerp(
        headRef.current.rotation.y,
        (mousePosition.x - 0.5) * 1.2,
        0.1
      );
      headRef.current.rotation.x = THREE.MathUtils.lerp(
        headRef.current.rotation.x,
        (mousePosition.y - 0.5) * -0.5,
        0.1
      );
    }

    // Eye glow pulsing
    if (leftEyeRef.current && rightEyeRef.current) {
      const intensity = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
      leftEyeRef.current.material.emissiveIntensity = intensity;
      rightEyeRef.current.material.emissiveIntensity = intensity;
    }
  });

  return (
    <group ref={groupRef} position={[1.5, 0, 0]} scale={0.8}>
      {/* Body */}
      <mesh position={[0, -0.8, 0]}>
        <boxGeometry args={[1.2, 1.8, 0.6]} />
        <meshStandardMaterial 
          color="#1a1a2e" 
          metalness={0.9} 
          roughness={0.1} 
        />
      </mesh>

      {/* Body accent lines */}
      <mesh position={[0, -0.3, 0.31]}>
        <boxGeometry args={[0.8, 0.05, 0.01]} />
        <meshBasicMaterial color="#b026ff" />
      </mesh>
      <mesh position={[0, -0.5, 0.31]}>
        <boxGeometry args={[0.6, 0.03, 0.01]} />
        <meshBasicMaterial color="#00d4ff" />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 0.3, 16]} />
        <meshStandardMaterial color="#12121a" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Head */}
      <group ref={headRef} position={[0, 0.8, 0]}>
        {/* Main head */}
        <mesh>
          <boxGeometry args={[0.9, 0.9, 0.7]} />
          <meshStandardMaterial 
            color="#12121a" 
            metalness={0.95} 
            roughness={0.05} 
          />
        </mesh>

        {/* Visor */}
        <mesh position={[0, 0.05, 0.36]}>
          <boxGeometry args={[0.7, 0.35, 0.02]} />
          <meshStandardMaterial 
            color="#0a0a0f" 
            metalness={1} 
            roughness={0} 
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* Left Eye */}
        <mesh ref={leftEyeRef} position={[-0.2, 0.05, 0.37]}>
          <circleGeometry args={[0.1, 32]} />
          <meshStandardMaterial 
            color="#00d4ff" 
            emissive="#00d4ff"
            emissiveIntensity={1}
          />
        </mesh>

        {/* Right Eye */}
        <mesh ref={rightEyeRef} position={[0.2, 0.05, 0.37]}>
          <circleGeometry args={[0.1, 32]} />
          <meshStandardMaterial 
            color="#00d4ff" 
            emissive="#00d4ff"
            emissiveIntensity={1}
          />
        </mesh>

        {/* Antenna */}
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />
          <meshStandardMaterial color="#1a1a2e" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.7, 0]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial 
            color="#ff2d95" 
            emissive="#ff2d95"
            emissiveIntensity={1.5}
          />
        </mesh>
      </group>

      {/* Left Arm */}
      <group position={[-0.85, -0.5, 0]}>
        <mesh>
          <capsuleGeometry args={[0.12, 0.8, 8, 16]} />
          <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Shoulder joint */}
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#12121a" metalness={0.9} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group position={[0.85, -0.5, 0]}>
        <mesh>
          <capsuleGeometry args={[0.12, 0.8, 8, 16]} />
          <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Shoulder joint */}
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#12121a" metalness={0.9} />
        </mesh>
      </group>

      {/* Chest light */}
      <mesh position={[0, -0.6, 0.31]}>
        <circleGeometry args={[0.12, 6]} />
        <meshStandardMaterial 
          color="#b026ff" 
          emissive="#b026ff"
          emissiveIntensity={2}
        />
      </mesh>

      {/* Point lights for glow effect */}
      <pointLight position={[0, 0.8, 0.5]} color="#00d4ff" intensity={0.5} distance={2} />
      <pointLight position={[0, -0.6, 0.5]} color="#b026ff" intensity={0.3} distance={1.5} />
    </group>
  );
}
