"use client";

import React, { useRef, useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture, Environment, ContactShadows } from '@react-three/drei';
import { useDrag } from '@use-gesture/react';

interface Project {
  id: string | number;
  title: string;
  image: string;
  [key: string]: any;
}

interface CylinderGalleryProps {
  projects: Project[];
  onActiveIndexChange: (index: number) => void;
}

const CurvedImage = ({ 
  url, 
  radius, 
  height, 
  itemAngle, 
  angleOffset 
}: { 
  url: string; 
  radius: number; 
  height: number; 
  itemAngle: number; 
  angleOffset: number;
}) => {
  const texture = useTexture(url);
  texture.colorSpace = THREE.SRGBColorSpace;
  const gap = 0.05;
  const thetaLength = itemAngle - gap;
  const thetaStart = -thetaLength / 2;

  return (
    <group rotation={[0, angleOffset, 0]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, height, 32, 1, true, thetaStart, thetaLength]} />
        <meshStandardMaterial 
          map={texture} 
          side={THREE.DoubleSide} 
          roughness={0.2}
          metalness={0.1}
          transparent={true}
        />
      </mesh>
    </group>
  );
};

const CylinderScene = ({ projects, onActiveIndexChange }: CylinderGalleryProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const targetRotation = useRef(0);
  const currentRotation = useRef(0);
  const isDragging = useRef(false);
  
  const N = projects.length;
  const radius = Math.max(3, N * 0.4); 
  const height = 4;
  const itemAngle = (Math.PI * 2) / N;
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const deltaY = currentScroll - lastScrollY.current;
      targetRotation.current += deltaY * 0.002;
      lastScrollY.current = currentScroll;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const bind = useDrag(({ active, delta: [dx], velocity: [vx] }) => {
    isDragging.current = active;
    if (active) {
      targetRotation.current += dx * 0.01;
    } else {
      targetRotation.current += dx * vx * 0.05;
    }
  });

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    if (!isDragging.current) {
      targetRotation.current += delta * 0.05;
    }
    currentRotation.current = THREE.MathUtils.damp(
      currentRotation.current,
      targetRotation.current,
      4,
      delta
    );
    groupRef.current.rotation.y = currentRotation.current;

    let frontAngle = -currentRotation.current % (Math.PI * 2);
    if (frontAngle < 0) frontAngle += Math.PI * 2;
    
    let activeIdx = Math.round(frontAngle / itemAngle) % N;
    if (activeIdx < 0) activeIdx += N;
    
    if (groupRef.current.userData.activeIndex !== activeIdx) {
      groupRef.current.userData.activeIndex = activeIdx;
      onActiveIndexChange(activeIdx);
    }
  });

  return (
    <>
      <fog attach="fog" args={['#0f172a', radius - 1, radius + 5]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[0, 5, 5]} intensity={1.5} castShadow />
      <spotLight position={[0, -2, 4]} intensity={2} color="#4f46e5" distance={10} angle={0.5} penumbra={1} />
      <group {...(bind() as any)}>
        <group ref={groupRef} position={[0, 0, -radius + 2]}>
          {projects.map((project, i) => (
            <CurvedImage 
              key={project.id || i}
              url={project.image}
              radius={radius}
              height={height}
              itemAngle={itemAngle}
              angleOffset={i * itemAngle}
            />
          ))}
        </group>
      </group>
      <ContactShadows position={[0, -height / 2 - 0.5, 0]} opacity={0.4} scale={20} blur={2} far={10} />
      <Environment preset="city" />
    </>
  );
};

export const CylinderGallery = ({ projects, onActiveIndexChange }: CylinderGalleryProps) => {
  return (
    <div className="w-full h-[60vh] md:h-[70vh] cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <CylinderScene projects={projects} onActiveIndexChange={onActiveIndexChange} />
      </Canvas>
    </div>
  );
};
