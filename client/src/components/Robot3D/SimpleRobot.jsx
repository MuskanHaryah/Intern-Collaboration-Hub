import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Cute chibi robot with big head and glowing eyes
export function SimpleRobot({ mousePosition }) {
  const groupRef = useRef();
  const headRef = useRef();
  const leftEyeRef = useRef();
  const rightEyeRef = useRef();

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (groupRef.current) {
      // Subtle body sway
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        (mousePosition.x - 0.5) * 0.3,
        0.03
      );
    }

    if (headRef.current) {
      // Head follows cursor
      headRef.current.rotation.y = THREE.MathUtils.lerp(
        headRef.current.rotation.y,
        (mousePosition.x - 0.5) * 0.6,
        0.05
      );
      headRef.current.rotation.x = THREE.MathUtils.lerp(
        headRef.current.rotation.x,
        (mousePosition.y - 0.5) * -0.3,
        0.05
      );
    }

    // Pulsing eye glow
    const pulse = 0.8 + Math.sin(time * 2) * 0.2;
    if (leftEyeRef.current) leftEyeRef.current.intensity = pulse * 2;
    if (rightEyeRef.current) rightEyeRef.current.intensity = pulse * 2;
  });

  // Glossy black material
  const glossyBlack = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#0a0a0a',
    metalness: 0.9,
    roughness: 0.1,
    envMapIntensity: 1.5,
  }), []);

  // Eye glow color - pinkish purple
  const eyeColor = '#c840ff';

  return (
    <group ref={groupRef} position={[0.5, -0.3, 0]} scale={1.4}>
      
      {/* === BIG SPHERICAL HEAD === */}
      <group ref={headRef} position={[0, 1.1, 0]}>
        {/* Main head sphere - large and glossy */}
        <mesh castShadow>
          <sphereGeometry args={[0.7, 64, 64]} />
          <meshStandardMaterial
            color="#050505"
            metalness={0.95}
            roughness={0.05}
            envMapIntensity={2}
          />
        </mesh>

        {/* Head highlight rim */}
        <mesh position={[0, 0.15, 0]} scale={[1.01, 1.01, 1.01]}>
          <sphereGeometry args={[0.7, 64, 64, 0, Math.PI * 2, 0, Math.PI * 0.3]} />
          <meshStandardMaterial
            color="#333333"
            metalness={1}
            roughness={0}
            transparent
            opacity={0.3}
          />
        </mesh>

        {/* === LEFT EYE === */}
        <group position={[-0.22, -0.05, 0.55]}>
          {/* Eye socket/base */}
          <mesh>
            <capsuleGeometry args={[0.08, 0.15, 8, 16]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
          
          {/* Glowing eye with scan lines effect */}
          <mesh position={[0, 0, 0.02]}>
            <capsuleGeometry args={[0.065, 0.12, 8, 16]} />
            <meshBasicMaterial color={eyeColor} transparent opacity={0.9} />
          </mesh>
          
          {/* Eye scan lines */}
          {[-0.06, -0.03, 0, 0.03, 0.06].map((y, i) => (
            <mesh key={i} position={[0, y, 0.05]}>
              <boxGeometry args={[0.12, 0.012, 0.01]} />
              <meshBasicMaterial color={eyeColor} />
            </mesh>
          ))}

          {/* Eye glow light */}
          <pointLight ref={leftEyeRef} color={eyeColor} intensity={2} distance={2} />
        </group>

        {/* === RIGHT EYE === */}
        <group position={[0.22, -0.05, 0.55]}>
          {/* Eye socket/base */}
          <mesh>
            <capsuleGeometry args={[0.08, 0.15, 8, 16]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
          
          {/* Glowing eye */}
          <mesh position={[0, 0, 0.02]}>
            <capsuleGeometry args={[0.065, 0.12, 8, 16]} />
            <meshBasicMaterial color={eyeColor} transparent opacity={0.9} />
          </mesh>
          
          {/* Eye scan lines */}
          {[-0.06, -0.03, 0, 0.03, 0.06].map((y, i) => (
            <mesh key={i} position={[0, y, 0.05]}>
              <boxGeometry args={[0.12, 0.012, 0.01]} />
              <meshBasicMaterial color={eyeColor} />
            </mesh>
          ))}

          {/* Eye glow light */}
          <pointLight ref={rightEyeRef} color={eyeColor} intensity={2} distance={2} />
        </group>
      </group>

      {/* === NECK === */}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 0.1, 16]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* === COMPACT BODY === */}
      <group position={[0, 0, 0]}>
        {/* Chest */}
        <mesh position={[0, 0.1, 0]}>
          <capsuleGeometry args={[0.22, 0.15, 16, 32]} />
          <meshStandardMaterial color="#080808" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Lower body */}
        <mesh position={[0, -0.15, 0]}>
          <sphereGeometry args={[0.18, 32, 32]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.85} roughness={0.15} />
        </mesh>
      </group>

      {/* === LEFT ARM === */}
      <group position={[-0.28, 0.15, 0]}>
        {/* Shoulder ball */}
        <mesh>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.1} />
        </mesh>
        
        {/* Upper arm */}
        <mesh position={[-0.08, -0.12, 0]} rotation={[0, 0, 0.3]}>
          <capsuleGeometry args={[0.05, 0.12, 8, 16]} />
          <meshStandardMaterial color="#080808" metalness={0.85} roughness={0.15} />
        </mesh>

        {/* Elbow */}
        <mesh position={[-0.15, -0.25, 0]}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Forearm */}
        <mesh position={[-0.18, -0.4, 0.02]} rotation={[0.2, 0, 0.15]}>
          <capsuleGeometry args={[0.04, 0.12, 8, 16]} />
          <meshStandardMaterial color="#080808" metalness={0.85} roughness={0.15} />
        </mesh>

        {/* Hand */}
        <group position={[-0.2, -0.55, 0.05]}>
          <mesh>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Fingers */}
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[-0.02 + i * 0.02, -0.05, 0]} rotation={[0.2, 0, 0]}>
              <capsuleGeometry args={[0.012, 0.025, 4, 8]} />
              <meshStandardMaterial color="#080808" metalness={0.85} roughness={0.15} />
            </mesh>
          ))}
        </group>
      </group>

      {/* === RIGHT ARM === */}
      <group position={[0.28, 0.15, 0]}>
        {/* Shoulder ball */}
        <mesh>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.1} />
        </mesh>
        
        {/* Upper arm */}
        <mesh position={[0.08, -0.12, 0]} rotation={[0, 0, -0.3]}>
          <capsuleGeometry args={[0.05, 0.12, 8, 16]} />
          <meshStandardMaterial color="#080808" metalness={0.85} roughness={0.15} />
        </mesh>

        {/* Elbow */}
        <mesh position={[0.15, -0.25, 0]}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Forearm */}
        <mesh position={[0.18, -0.4, 0.02]} rotation={[0.2, 0, -0.15]}>
          <capsuleGeometry args={[0.04, 0.12, 8, 16]} />
          <meshStandardMaterial color="#080808" metalness={0.85} roughness={0.15} />
        </mesh>

        {/* Hand */}
        <group position={[0.2, -0.55, 0.05]}>
          <mesh>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Fingers */}
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[-0.02 + i * 0.02, -0.05, 0]} rotation={[0.2, 0, 0]}>
              <capsuleGeometry args={[0.012, 0.025, 4, 8]} />
              <meshStandardMaterial color="#080808" metalness={0.85} roughness={0.15} />
            </mesh>
          ))}
        </group>
      </group>

      {/* === LEFT LEG === */}
      <group position={[-0.12, -0.35, 0]}>
        {/* Hip joint */}
        <mesh>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Upper leg */}
        <mesh position={[0, -0.12, 0]}>
          <capsuleGeometry args={[0.055, 0.1, 8, 16]} />
          <meshStandardMaterial color="#080808" metalness={0.85} roughness={0.15} />
        </mesh>

        {/* Knee */}
        <mesh position={[0, -0.25, 0]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Lower leg */}
        <mesh position={[0, -0.4, 0]}>
          <capsuleGeometry args={[0.045, 0.12, 8, 16]} />
          <meshStandardMaterial color="#080808" metalness={0.85} roughness={0.15} />
        </mesh>

        {/* Foot */}
        <mesh position={[0, -0.55, 0.03]}>
          <boxGeometry args={[0.08, 0.05, 0.14]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* === RIGHT LEG === */}
      <group position={[0.12, -0.35, 0]}>
        {/* Hip joint */}
        <mesh>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Upper leg */}
        <mesh position={[0, -0.12, 0]}>
          <capsuleGeometry args={[0.055, 0.1, 8, 16]} />
          <meshStandardMaterial color="#080808" metalness={0.85} roughness={0.15} />
        </mesh>

        {/* Knee */}
        <mesh position={[0, -0.25, 0]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Lower leg */}
        <mesh position={[0, -0.4, 0]}>
          <capsuleGeometry args={[0.045, 0.12, 8, 16]} />
          <meshStandardMaterial color="#080808" metalness={0.85} roughness={0.15} />
        </mesh>

        {/* Foot */}
        <mesh position={[0, -0.55, 0.03]}>
          <boxGeometry args={[0.08, 0.05, 0.14]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* Ambient fill light */}
      <pointLight position={[0, 1.5, 2]} color="#ffffff" intensity={0.5} distance={5} />
    </group>
  );
}
