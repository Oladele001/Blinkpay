"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";

function AnimatedSphere({ position, size, color, speed = 1 }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.5;
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <Sphere ref={meshRef} args={[size, 16, 16]} position={position}>
      <meshStandardMaterial 
        color={color} 
        emissive={color} 
        emissiveIntensity={0.3} 
        roughness={0.3}
        metalness={0.8}
      />
    </Sphere>
  );
}

export default function FloatingSpheres() {
  const spheres = [
    { position: [-4, 2, -5], size: 1.5, color: "#9945FF", speed: 0.8 },
    { position: [5, -1, -6], size: 1.2, color: "#14F195", speed: 1.2 },
    { position: [0, 3, -4], size: 0.8, color: "#06b6d4", speed: 0.6 },
    { position: [-2, -2, -7], size: 1.0, color: "#9945FF", speed: 1.0 },
    { position: [3, 1, -3], size: 0.6, color: "#14F195", speed: 0.9 },
  ];

  return (
    <>
      {spheres.map((sphere, index) => (
        <AnimatedSphere
          key={index}
          position={sphere.position}
          size={sphere.size}
          color={sphere.color}
          speed={sphere.speed}
        />
      ))}
    </>
  );
}
