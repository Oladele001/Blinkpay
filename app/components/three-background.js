"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere, Stars } from "@react-three/drei";
import * as THREE from "three";

function AnimatedSphere({ position, color, speed = 1 }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.001 * speed;
      meshRef.current.rotation.y += 0.002 * speed;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <Sphere ref={meshRef} position={position} args={[0.3, 32, 32]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
}

function ParticleField() {
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 100; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
        ],
        color: Math.random() > 0.5 ? "#9945FF" : "#14F195",
        size: Math.random() * 0.02 + 0.01,
      });
    }
    return temp;
  }, []);

  return (
    <>
      {particles.map((particle, i) => (
        <mesh key={i} position={particle.position}>
          <sphereGeometry args={[particle.size, 8, 8]} />
          <meshBasicMaterial color={particle.color} />
        </mesh>
      ))}
    </>
  );
}

export default function ThreeBackground() {
  return (
    <div id="three-canvas">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#9945FF" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#14F195" />
        
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />
        
        <AnimatedSphere position={[-2, 1, 0]} color="#9945FF" speed={0.5} />
        <AnimatedSphere position={[2, -1, -1]} color="#14F195" speed={0.8} />
        <AnimatedSphere position={[0, 2, 1]} color="#06b6d4" speed={1.2} />
        
        <ParticleField />
      </Canvas>
    </div>
  );
}
