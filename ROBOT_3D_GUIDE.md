# 🤖 3D Robot Implementation Guide

## Overview
This guide explains how to implement the interactive 3D robot that follows your cursor, similar to the effect shown in the reference images.

---

## 🎯 What You Need

### 1. 3D Robot Model (Required)

**Best Free Sources:**

| Source | Link | Format | Notes |
|--------|------|--------|-------|
| **Sketchfab** | [sketchfab.com/search?q=robot](https://sketchfab.com/search?q=robot&type=models&features=downloadable) | GLB/GLTF | Best quality, many free options |
| **Poly Pizza** | [poly.pizza/search/robot](https://poly.pizza/search/robot) | GLB | Low-poly, fast loading |
| **Mixamo** | [mixamo.com](https://www.mixamo.com/) | FBX | Characters with animations |
| **Ready Player Me** | [readyplayer.me](https://readyplayer.me/) | GLB | Custom avatars |

**Recommended Search Terms:**
- "humanoid robot"
- "sci-fi robot"
- "android robot"
- "robot assistant"

**Model Requirements:**
- Format: `.glb` (preferred) or `.gltf`
- File size: Under 5MB for fast loading
- Rigged: Optional but nice for animations
- Look for CC0 or CC-BY license for commercial use

---

## 🔧 Technical Implementation

### Step 1: Install Dependencies

```bash
cd client
npm install @react-three/fiber @react-three/drei three
```

### Step 2: Create Mouse Tracking Hook

```jsx
// src/hooks/useMousePosition.js
import { useState, useEffect } from 'react';

export function useMousePosition() {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({
        x: event.clientX / window.innerWidth,
        y: event.clientY / window.innerHeight,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return mousePosition;
}
```

### Step 3: Create 3D Scene Component

```jsx
// src/components/Robot3D/RobotScene.jsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { Suspense } from 'react';
import { Robot } from './Robot';
import { useMousePosition } from '../../hooks/useMousePosition';

export function RobotScene() {
  const mousePosition = useMousePosition();

  return (
    <div className="robot-container" style={{ 
      width: '50%', 
      height: '100vh',
      position: 'absolute',
      right: 0,
      top: 0
    }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            intensity={1}
            color="#b026ff"
          />
          <pointLight position={[-10, -10, -10]} color="#ff2d95" intensity={0.5} />
          
          {/* Robot */}
          <Robot mousePosition={mousePosition} />
          
          {/* Environment for reflections */}
          <Environment preset="city" />
          
          {/* Shadow */}
          <ContactShadows
            position={[0, -1.5, 0]}
            opacity={0.5}
            scale={10}
            blur={2}
            far={4}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
```

### Step 4: Create Robot Component with Cursor Tracking

```jsx
// src/components/Robot3D/Robot.jsx
import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export function Robot({ mousePosition }) {
  const groupRef = useRef();
  const headRef = useRef();
  const eyesRef = useRef();
  
  // Load your robot model
  const { scene, nodes } = useGLTF('/models/robot.glb');

  // Clone the scene to avoid mutation issues
  useEffect(() => {
    if (scene) {
      // Find head bone/mesh in your model
      // This depends on your model's structure
      scene.traverse((child) => {
        if (child.name.toLowerCase().includes('head')) {
          headRef.current = child;
        }
        if (child.name.toLowerCase().includes('eye')) {
          eyesRef.current = child;
        }
      });
    }
  }, [scene]);

  // Animate robot to look at cursor
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Subtle body sway
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        (mousePosition.x - 0.5) * 0.3,
        0.05
      );
    }

    if (headRef.current) {
      // Head follows cursor more dramatically
      const targetRotationY = (mousePosition.x - 0.5) * Math.PI * 0.4;
      const targetRotationX = (mousePosition.y - 0.5) * Math.PI * 0.2;

      headRef.current.rotation.y = THREE.MathUtils.lerp(
        headRef.current.rotation.y,
        targetRotationY,
        0.1
      );
      headRef.current.rotation.x = THREE.MathUtils.lerp(
        headRef.current.rotation.x,
        targetRotationX,
        0.1
      );
    }

    // Optional: Add idle animation (gentle breathing motion)
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.02;
    }
  });

  return (
    <group ref={groupRef} position={[1, -1, 0]} scale={1.5}>
      <primitive object={scene} />
    </group>
  );
}

// Preload model for better performance
useGLTF.preload('/models/robot.glb');
```

### Step 5: Alternative - Simple Geometric Robot

If you don't have a 3D model yet, here's a geometric robot:

```jsx
// src/components/Robot3D/SimpleRobot.jsx
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function SimpleRobot({ mousePosition }) {
  const headRef = useRef();
  const bodyRef = useRef();
  const leftEyeRef = useRef();
  const rightEyeRef = useRef();

  useFrame(() => {
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
  });

  return (
    <group position={[1.5, 0, 0]}>
      {/* Body */}
      <mesh ref={bodyRef} position={[0, -0.5, 0]}>
        <boxGeometry args={[1, 1.5, 0.5]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Head */}
      <group ref={headRef} position={[0, 0.7, 0]}>
        <mesh>
          <boxGeometry args={[0.8, 0.8, 0.6]} />
          <meshStandardMaterial color="#12121a" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Eyes */}
        <mesh ref={leftEyeRef} position={[-0.2, 0.1, 0.31]}>
          <circleGeometry args={[0.12, 32]} />
          <meshBasicMaterial color="#00d4ff" />
        </mesh>
        <mesh ref={rightEyeRef} position={[0.2, 0.1, 0.31]}>
          <circleGeometry args={[0.12, 32]} />
          <meshBasicMaterial color="#00d4ff" />
        </mesh>

        {/* Visor glow */}
        <mesh position={[0, 0.1, 0.3]}>
          <planeGeometry args={[0.6, 0.2]} />
          <meshBasicMaterial color="#b026ff" transparent opacity={0.3} />
        </mesh>
      </group>

      {/* Arms */}
      <mesh position={[-0.7, -0.3, 0]}>
        <capsuleGeometry args={[0.1, 0.8, 8, 16]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.7, -0.3, 0]}>
        <capsuleGeometry args={[0.1, 0.8, 8, 16]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Neon accents */}
      <pointLight position={[0, 0.7, 0.5]} color="#00d4ff" intensity={0.5} distance={2} />
    </group>
  );
}
```

---

## 🎨 Integrating with Landing Page

```jsx
// src/pages/HomePage.jsx
import { RobotScene } from '../components/Robot3D/RobotScene';

export function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0f] overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20" />
      
      {/* Content */}
      <div className="relative z-10 flex items-center min-h-screen">
        {/* Left side - Text content */}
        <div className="w-1/2 px-16">
          <p className="text-purple-400 tracking-[0.3em] text-sm mb-4">
            REAL-TIME COLLABORATION
          </p>
          <h1 className="text-7xl font-bold text-white mb-6">
            COLLABORATE
          </h1>
          <p className="text-gray-400 text-lg mb-8 max-w-md">
            Enable interns to collaborate on real-time projects efficiently
            with our Kanban-style project board.
          </p>
          <div className="flex gap-4">
            <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 
              rounded-full text-white font-medium hover:shadow-lg 
              hover:shadow-purple-500/30 transition-all">
              Get Started
            </button>
            <button className="px-8 py-3 border border-purple-500/50 
              rounded-full text-white font-medium hover:bg-purple-500/10 
              transition-all">
              Learn More
            </button>
          </div>
        </div>

        {/* Right side - 3D Robot */}
        <RobotScene />
      </div>

      {/* Floating particles effect (optional) */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Add particles.js or custom floating dots */}
      </div>
    </div>
  );
}
```

---

## 🔥 Adding Glow Effects

```css
/* src/styles/glow.css */

/* Neon text glow */
.neon-text {
  text-shadow: 
    0 0 10px rgba(176, 38, 255, 0.8),
    0 0 20px rgba(176, 38, 255, 0.6),
    0 0 30px rgba(176, 38, 255, 0.4);
}

/* Button glow on hover */
.neon-button:hover {
  box-shadow: 
    0 0 20px rgba(176, 38, 255, 0.5),
    0 0 40px rgba(176, 38, 255, 0.3),
    inset 0 0 20px rgba(176, 38, 255, 0.1);
}

/* Card glow border */
.glow-card {
  border: 1px solid rgba(176, 38, 255, 0.3);
  box-shadow: 
    0 0 15px rgba(176, 38, 255, 0.1),
    inset 0 0 15px rgba(176, 38, 255, 0.05);
}
```

---

## 🚀 Performance Tips

1. **Compress your 3D model** using [gltf.report](https://gltf.report/) or [glTF-Pipeline](https://github.com/CesiumGS/gltf-pipeline)

2. **Use draco compression**:
   ```jsx
   import { useGLTF } from '@react-three/drei';
   const { scene } = useGLTF('/models/robot.glb', true); // Enable draco
   ```

3. **Lazy load the 3D scene**:
   ```jsx
   const RobotScene = lazy(() => import('./components/Robot3D/RobotScene'));
   ```

4. **Reduce polygon count** for mobile devices

5. **Use instancedMesh** for repeated elements

---

## 📱 Mobile Considerations

For mobile, use touch tracking instead of mouse:

```jsx
useEffect(() => {
  const handleTouch = (event) => {
    const touch = event.touches[0];
    setMousePosition({
      x: touch.clientX / window.innerWidth,
      y: touch.clientY / window.innerHeight,
    });
  };

  window.addEventListener('touchmove', handleTouch);
  return () => window.removeEventListener('touchmove', handleTouch);
}, []);
```

---

## 🎯 Quick Model Setup

1. Download a robot model from Sketchfab
2. Place it in `client/public/models/robot.glb`
3. Update the path in `useGLTF('/models/robot.glb')`
4. Adjust position and scale based on your model's size
5. Find and reference the head bone name for tracking

That's it! Your interactive 3D robot is ready! 🤖
