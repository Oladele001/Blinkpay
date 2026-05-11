"use client";

import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere, Stars } from "@react-three/drei";
import * as THREE from "three";
import FloatingSpheres from "./FloatingSpheres";

function AnimatedSphere({ position, color, speed = 1 }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.001 * speed;
      meshRef.current.rotation.y += 0.002 * speed;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.1;
    }
  });

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 30; i++) {
      temp.push({
        id: i,
        position: [
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 15,
        ],
        size: Math.random() * 0.4 + 0.1,
        color: Math.random() > 0.5 ? "#9945FF" : "#14F195",
        speed: Math.random() * 0.02 + 0.01,
        amplitude: Math.random() * 2 + 1,
      });
    }
    return temp;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
      groupRef.current.rotation.x += 0.0005;
    }
  });

  function AnimatedSphere({ particle }) {
    const meshRef = useRef();
    const [scale, setScale] = useState(1);

    useFrame((state) => {
      if (meshRef.current) {
        meshRef.current.position.y = particle.position[1] + 
          Math.sin(state.clock.elapsedTime * particle.speed) * particle.amplitude;
        meshRef.current.rotation.x += 0.01;
        meshRef.current.rotation.y += 0.01;
      }
    });

    return (
      <Float
        speed={particle.speed * 2}
        rotationIntensity={0.5}
        floatIntensity={0.5}
      >
        <mesh
          ref={meshRef}
          position={particle.position}
          onPointerOver={() => {
            setHoveredSphere(particle.id);
            setScale(1.5);
          }}
          onPointerOut={() => {
            setHoveredSphere(null);
            setScale(1);
          }}
          scale={scale}
        >
          <sphereGeometry args={[particle.size, 16, 16]} />
          <meshBasicMaterial 
            color={particle.color}
            opacity={hoveredSphere === particle.id ? 1 : 0.7}
            transparent
          />
        </mesh>
      </Float>
    );
  }

  return (
    <group ref={groupRef}>
      {particles.map((particle) => (
        <AnimatedSphere key={particle.id} particle={particle} />
      ))}
    </group>
  );
}

function RotatingRings() {
  const ringRef = useRef();
  const innerRingRef = useRef();

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.005;
      ringRef.current.rotation.y += 0.002;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z -= 0.008;
      innerRingRef.current.rotation.x += 0.003;
    }
  });

  return (
    <group>
      <mesh ref={ringRef} position={[0, 0, 0]}>
        <torusGeometry args={[8, 0.1, 16, 100]} />
        <meshBasicMaterial color="#9945FF" opacity={0.3} transparent />
      </mesh>
      <mesh ref={innerRingRef} position={[0, 0, 0]}>
        <torusGeometry args={[5, 0.08, 16, 100]} />
        <meshBasicMaterial color="#14F195" opacity={0.3} transparent />
      </mesh>
    </group>
  );
}

function PulsingCube() {
  const cubeRef = useRef();
  const [scale, setScale] = useState(1);

  useFrame((state) => {
    if (cubeRef.current) {
      const pulseScale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      cubeRef.current.scale.set(pulseScale, pulseScale, pulseScale);
      cubeRef.current.rotation.x += 0.01;
      cubeRef.current.rotation.y += 0.01;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={cubeRef} position={[3, 2, -2]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshBasicMaterial color="#9945FF" opacity={0.6} transparent />
      </mesh>
    </Float>
  );
}

export default function ThreeBackgroundComponent() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 50 }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#9945FF" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#14F195" />
        
        <Stars
          radius={300}
          depth={50}
          count={800}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />
        
        <FloatingSpheres />
        <RotatingRings />
        <PulsingCube />
      </Canvas>
    </div>
  );
}
