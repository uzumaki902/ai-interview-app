"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import React, { useMemo, useRef } from "react";
import * as THREE from "three";

interface AI3DAvatarProps {
  isSpeaking: boolean;
  isListening: boolean;
}

function AvatarHead({ isSpeaking, isListening }: AI3DAvatarProps) {
  const groupRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const mouthRef = useRef<THREE.Mesh>(null);

  const skinMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: new THREE.Color(0xffd6b5) }),
    []
  );
  const eyeWhiteMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: new THREE.Color(0xffffff) }),
    []
  );
  const eyeIrisMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: new THREE.Color(0x3b82f6) }),
    []
  );
  const mouthMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: new THREE.Color(0x9f1239) }),
    []
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Idle head motion
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.05;
      groupRef.current.rotation.x = Math.sin(t * 0.3) * 0.02;
    }

    // Blinking (periodic)
    const blink = Math.max(0, Math.sin(t * 3.2)); // 0..1
    const blinkAmount = blink > 0.98 ? 0.1 : 1; // quick close
    if (leftEyeRef.current && rightEyeRef.current) {
      leftEyeRef.current.scale.y = blinkAmount;
      rightEyeRef.current.scale.y = blinkAmount;
    }

    // Mouth animation: larger when speaking, subtle when listening
    if (mouthRef.current) {
      const base = isSpeaking ? 0.25 : isListening ? 0.12 : 0.06;
      const osc = Math.abs(Math.sin(t * (isSpeaking ? 10 : 6))) * (isSpeaking ? 0.15 : 0.06);
      mouthRef.current.scale.y = base + osc;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Head */}
      <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <primitive object={skinMat} attach="material" />
      </mesh>

      {/* Eyes (white) */}
      <mesh position={[-0.35, 0.8, 0.85]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <primitive object={eyeWhiteMat} attach="material" />
      </mesh>
      <mesh position={[0.35, 0.8, 0.85]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <primitive object={eyeWhiteMat} attach="material" />
      </mesh>

      {/* Eyelids (scale Y to blink) */}
      <mesh ref={leftEyeRef} position={[-0.35, 0.8, 0.92]}
        scale={[1, 1, 1]}
      >
        <boxGeometry args={[0.36, 0.18, 0.05]} />
        <primitive object={skinMat} attach="material" />
      </mesh>
      <mesh ref={rightEyeRef} position={[0.35, 0.8, 0.92]}
        scale={[1, 1, 1]}
      >
        <boxGeometry args={[0.36, 0.18, 0.05]} />
        <primitive object={skinMat} attach="material" />
      </mesh>

      {/* Iris/Pupil */}
      <mesh position={[-0.35, 0.78, 1.02]}>
        <circleGeometry args={[0.08, 16]} />
        <primitive object={eyeIrisMat} attach="material" />
      </mesh>
      <mesh position={[0.35, 0.78, 1.02]}>
        <circleGeometry args={[0.08, 16]} />
        <primitive object={eyeIrisMat} attach="material" />
      </mesh>

      {/* Mouth */}
      <mesh ref={mouthRef} position={[0, 0.25, 0.98]} scale={[1, 0.06, 1]}>
        <boxGeometry args={[0.6, 0.2, 0.1]} />
        <primitive object={mouthMat} attach="material" />
      </mesh>

      {/* Neck */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.4, 16]} />
        <primitive object={skinMat} attach="material" />
      </mesh>

      {/* Shoulders (simple) */}
      <mesh position={[0, -0.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.5, 1]} />
        <meshStandardMaterial color={0x1f2937} />
      </mesh>
    </group>
  );
}

export default function AI3DAvatar({ isSpeaking, isListening }: AI3DAvatarProps) {
  return (
    <div className="w-full h-56 sm:h-64 md:h-72 rounded-lg overflow-hidden border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <Canvas shadows camera={{ position: [0, 1.5, 3], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 5, 2]} intensity={1} castShadow />
        <AvatarHead isSpeaking={isSpeaking} isListening={isListening} />
        <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI/3} maxPolarAngle={Math.PI/2} />
      </Canvas>
    </div>
  );
}
