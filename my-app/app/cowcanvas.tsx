// _CowCanvas.tsx
// Improved 3D cow with IoT collar, stable lighting, and subtle animations.
// No bloom – clean, sharp rendering.

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  PerspectiveCamera,
  OrbitControls,
  RoundedBox,
  Sparkles,
  Float,
} from "@react-three/drei";
import * as THREE from "three";

// ─── IoT Smart Collar (enhanced) ─────────────────────────────────────────────
function IoTCollar() {
  const ledMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const glowRef = useRef<THREE.PointLight>(null);
  const antennaRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const phase = t % 1.6;
    const blink = phase < 0.12 || (phase > 0.25 && phase < 0.37) ? 1 : 0;
    if (ledMatRef.current) ledMatRef.current.emissiveIntensity = blink * 3.5;
    if (glowRef.current) glowRef.current.intensity = blink * 1.8;
    if (antennaRef.current)
      antennaRef.current.rotation.z = Math.sin(t * 0.9) * 0.06;
  });

  return (
    // Tilt forward ~52 degrees (-0.9 rad) – more than before
    <group position={[0, 1.2324, 1]} rotation={[-0.9, 0, 0]}>
      {/* Leather collar */}
      <mesh castShadow>
        <torusGeometry args={[0.42, 0.04, 24, 64]} />
        <meshStandardMaterial
          color="#3b1f0a"
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>
      <mesh>
        <torusGeometry args={[0.42, 0.013, 8, 64]} />
        <meshStandardMaterial color="#5c3317" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.42, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.04, 0.01, 8, 12]} />
        <meshStandardMaterial color="#b87333" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* IoT Module – unchanged */}
      <group position={[0, -0.42, 0]}>
        <RoundedBox
          args={[0.23, 0.27, 0.11]}
          radius={0.026}
          smoothness={6}
          castShadow
        >
          <meshStandardMaterial
            color="#0d0d0d"
            roughness={0.3}
            metalness={0.18}
          />
        </RoundedBox>
        <RoundedBox
          args={[0.19, 0.23, 0.018]}
          radius={0.014}
          smoothness={4}
          position={[0, 0, 0.056]}
        >
          <meshStandardMaterial
            color="#181818"
            roughness={0.18}
            metalness={0.35}
          />
        </RoundedBox>
        <RoundedBox
          args={[0.13, 0.028, 0.005]}
          radius={0.004}
          position={[0, 0.075, 0.066]}
        >
          <meshStandardMaterial
            color="#10b981"
            roughness={0.35}
            emissive="#10b981"
            emissiveIntensity={0.4}
          />
        </RoundedBox>
        <RoundedBox
          args={[0.1, 0.055, 0.006]}
          radius={0.006}
          position={[0, 0.01, 0.066]}
        >
          <meshStandardMaterial
            color="#050510"
            roughness={0.05}
            emissive="#0a2a18"
            emissiveIntensity={0.6}
          />
        </RoundedBox>

        {/* Status LED */}
        <mesh position={[0.065, -0.05, 0.066]}>
          <sphereGeometry args={[0.017, 16, 16]} />
          <meshStandardMaterial
            ref={ledMatRef}
            color="#00ff88"
            emissive="#00ff88"
            emissiveIntensity={3.5}
            roughness={0}
          />
          <pointLight
            ref={glowRef}
            color="#00ff88"
            intensity={1.8}
            distance={0.45}
            decay={2}
          />
        </mesh>

        {/* Battery LED */}
        <mesh position={[-0.065, -0.05, 0.066]}>
          <sphereGeometry args={[0.012, 12, 12]} />
          <meshStandardMaterial
            color="#f59e0b"
            emissive="#f59e0b"
            emissiveIntensity={1.2}
          />
        </mesh>

        {/* GPS chip */}
        <RoundedBox
          args={[0.08, 0.08, 0.028]}
          radius={0.01}
          position={[0, 0.02, -0.07]}
        >
          <meshStandardMaterial
            color="#1a1a2e"
            roughness={0.15}
            metalness={0.75}
          />
        </RoundedBox>

        {/* Solar strip */}
        <RoundedBox
          args={[0.15, 0.038, 0.007]}
          radius={0.005}
          position={[0, 0.142, 0.038]}
        >
          <meshStandardMaterial
            color="#08081a"
            roughness={0.08}
            metalness={0.92}
          />
        </RoundedBox>

        {/* Micro-USB */}
        <RoundedBox
          args={[0.055, 0.016, 0.013]}
          radius={0.004}
          position={[0, -0.13, 0.044]}
        >
          <meshStandardMaterial
            color="#2a2a2a"
            roughness={0.25}
            metalness={0.85}
          />
        </RoundedBox>

        {/* Antenna */}
        <mesh ref={antennaRef} position={[0.1, 0.15, 0]}>
          <cylinderGeometry args={[0.007, 0.005, 0.13, 8]} />
          <meshStandardMaterial
            color="#1a1a1a"
            roughness={0.35}
            metalness={0.65}
          />
        </mesh>
        <mesh position={[0.1, 0.218, 0]}>
          <sphereGeometry args={[0.009, 8, 8]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#10b981"
            emissiveIntensity={1.0}
          />
        </mesh>

        {/* D-ring */}
        <mesh position={[0, 0.162, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.033, 0.007, 8, 16]} />
          <meshStandardMaterial
            color="#d0d0d0"
            roughness={0.08}
            metalness={1}
          />
        </mesh>
      </group>
    </group>
  );
}

// ─── Realistic Cow with improved animations & materials ──────────────────────

function RealisticCow() {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Group>(null);
  const earLRef = useRef<THREE.Mesh>(null);
  const earRRef = useRef<THREE.Mesh>(null);
  const eyeLRef = useRef<THREE.Mesh>(null);
  const eyeRRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current)
      groupRef.current.rotation.y = Math.sin(t * 0.28) * 0.03;
    if (headRef.current) {
      headRef.current.position.y = 1.82 + Math.sin(t * 1.15) * 0.014;
      headRef.current.rotation.x = Math.sin(t * 0.38) * 0.013;
    }
    if (tailRef.current) {
      tailRef.current.rotation.z = Math.sin(t * 1.9) * 0.38;
      tailRef.current.rotation.x = 0.28 + Math.sin(t * 1.1) * 0.1;
    }
    if (earLRef.current)
      earLRef.current.rotation.z = 0.3 + Math.sin(t * 2.1 + 1.0) * 0.09;
    if (earRRef.current)
      earRRef.current.rotation.z = -0.3 + Math.sin(t * 1.7) * 0.09;
    // Blinking (every 3-4 seconds)
    if (eyeLRef.current && eyeRRef.current) {
      const blink = Math.sin(t * 0.8) > 0.98 ? 0.02 : 0.075;
      eyeLRef.current.scale.y = blink;
      eyeRRef.current.scale.y = blink;
    }
  });

  // Memoized materials to avoid re‑creation
  const materials = useMemo(
    () => ({
      skin: new THREE.MeshStandardMaterial({
        color: "#f5f0e8",
        roughness: 0.88,
        metalness: 0,
      }),
      spot: new THREE.MeshStandardMaterial({
        color: "#1a1108",
        roughness: 0.85,
      }),
      nose: new THREE.MeshStandardMaterial({
        color: "#e8a090",
        roughness: 0.7,
      }),
      hoof: new THREE.MeshStandardMaterial({
        color: "#2a1f12",
        roughness: 0.6,
        metalness: 0.1,
      }),
      eye: new THREE.MeshStandardMaterial({
        color: "#090909",
        roughness: 0.05,
      }),
      shine: new THREE.MeshStandardMaterial({
        color: "#ffffff",
        roughness: 0,
        emissive: "#ffffff",
        emissiveIntensity: 0.5,
      }),
      horn: new THREE.MeshStandardMaterial({
        color: "#d4b483",
        roughness: 0.5,
        metalness: 0.05,
      }),
      udder: new THREE.MeshStandardMaterial({
        color: "#f0c8b0",
        roughness: 0.7,
      }),
    }),
    [],
  );

  return (
    <group ref={groupRef}>
      {/* Body */}
      <RoundedBox
        args={[1.05, 1.05, 2.1]}
        radius={0.22}
        smoothness={5}
        position={[0, 0.72, 0]}
        castShadow
      >
        <primitive object={materials.skin} attach="material" />
      </RoundedBox>
      <mesh position={[0, 0.65, 0.86]} castShadow>
        <sphereGeometry args={[0.52, 20, 20]} />
        <primitive object={materials.skin} attach="material" />
      </mesh>
      <RoundedBox
        args={[0.95, 0.93, 0.68]}
        radius={0.18}
        smoothness={4}
        position={[0, 0.78, -0.86]}
        castShadow
      >
        <primitive object={materials.skin} attach="material" />
      </RoundedBox>
      <mesh position={[0, 0.28, 0.05]} castShadow>
        <sphereGeometry args={[0.42, 16, 12]} />
        <primitive object={materials.skin} attach="material" />
      </mesh>

      {/* Spots */}
      <RoundedBox
        args={[0.55, 0.52, 0.75]}
        radius={0.12}
        position={[0.38, 0.85, 0.15]}
        rotation={[0.1, 0.2, 0.05]}
      >
        <primitive object={materials.spot} attach="material" />
      </RoundedBox>
      <RoundedBox
        args={[0.42, 0.38, 0.55]}
        radius={0.1}
        position={[-0.42, 0.65, -0.45]}
        rotation={[-0.05, -0.15, 0.1]}
      >
        <primitive object={materials.spot} attach="material" />
      </RoundedBox>
      <RoundedBox
        args={[0.3, 0.28, 0.4]}
        radius={0.08}
        position={[0.3, 0.5, -0.7]}
      >
        <primitive object={materials.spot} attach="material" />
      </RoundedBox>

      {/* Neck + dewlap */}
      <RoundedBox
        args={[0.52, 0.78, 0.55]}
        radius={0.14}
        smoothness={4}
        position={[0, 1.22, 0.82]}
        rotation={[-0.52, 0, 0]}
        castShadow
      >
        <primitive object={materials.skin} attach="material" />
      </RoundedBox>
      <mesh position={[0, 0.78, 0.95]} rotation={[-0.3, 0, 0]} castShadow>
        <sphereGeometry args={[0.22, 12, 10]} />
        <primitive object={materials.skin} attach="material" />
      </mesh>

      {/* Head */}
      <group ref={headRef} position={[0, 1.82, 1.35]}>
        <RoundedBox
          args={[0.65, 0.62, 0.78]}
          radius={0.13}
          smoothness={5}
          castShadow
        >
          <primitive object={materials.skin} attach="material" />
        </RoundedBox>
        {/* Cheeks */}
        <mesh position={[0.22, 0, 0.1]}>
          <sphereGeometry args={[0.25, 12, 10]} />
          <primitive object={materials.skin} attach="material" />
        </mesh>
        <mesh position={[-0.22, 0, 0.1]}>
          <sphereGeometry args={[0.25, 12, 10]} />
          <primitive object={materials.skin} attach="material" />
        </mesh>
        {/* Muzzle */}
        <RoundedBox
          args={[0.46, 0.36, 0.34]}
          radius={0.1}
          position={[0, -0.17, 0.45]}
          castShadow
        >
          <primitive object={materials.nose} attach="material" />
        </RoundedBox>
        {/* Nostrils */}
        <mesh position={[0.1, -0.185, 0.63]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.042, 0.038, 0.022, 12]} />
          <meshStandardMaterial color="#c06050" roughness={0.8} />
        </mesh>
        <mesh position={[-0.1, -0.185, 0.63]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.042, 0.038, 0.022, 12]} />
          <meshStandardMaterial color="#c06050" roughness={0.8} />
        </mesh>
        {/* Eyes with blink */}
        <group position={[0.27, 0.12, 0.35]}>
          <mesh>
            <sphereGeometry args={[0.075, 16, 16]} />
            <primitive object={materials.eye} attach="material" />
          </mesh>
          <mesh ref={eyeLRef} position={[0.02, 0.03, 0.065]}>
            <sphereGeometry args={[0.018, 8, 8]} />
            <primitive object={materials.shine} attach="material" />
          </mesh>
          <mesh position={[0, 0.04, 0.06]} rotation={[0.2, 0, 0]}>
            <torusGeometry args={[0.062, 0.013, 6, 16, Math.PI]} />
            <primitive object={materials.skin} attach="material" />
          </mesh>
        </group>
        <group position={[-0.27, 0.12, 0.35]}>
          <mesh>
            <sphereGeometry args={[0.075, 16, 16]} />
            <primitive object={materials.eye} attach="material" />
          </mesh>
          <mesh ref={eyeRRef} position={[-0.02, 0.03, 0.065]}>
            <sphereGeometry args={[0.018, 8, 8]} />
            <primitive object={materials.shine} attach="material" />
          </mesh>
          <mesh position={[0, 0.04, 0.06]} rotation={[0.2, 0, 0]}>
            <torusGeometry args={[0.062, 0.013, 6, 16, Math.PI]} />
            <primitive object={materials.skin} attach="material" />
          </mesh>
        </group>
        {/* Ears */}
        <mesh
          ref={earRRef}
          position={[0.4, 0.22, 0.05]}
          rotation={[0.1, 0.2, 0.3]}
          castShadow
        >
          <sphereGeometry args={[0.15, 12, 8]} />
          <primitive object={materials.skin} attach="material" />
        </mesh>
        <mesh position={[0.4, 0.22, 0.05]} rotation={[0.1, 0.2, 0.3]}>
          <sphereGeometry args={[0.09, 10, 7]} />
          <meshStandardMaterial color="#f0a8a0" roughness={0.7} />
        </mesh>
        <mesh
          ref={earLRef}
          position={[-0.4, 0.22, 0.05]}
          rotation={[0.1, -0.2, -0.3]}
          castShadow
        >
          <sphereGeometry args={[0.15, 12, 8]} />
          <primitive object={materials.skin} attach="material" />
        </mesh>
        <mesh position={[-0.4, 0.22, 0.05]} rotation={[0.1, -0.2, -0.3]}>
          <sphereGeometry args={[0.09, 10, 7]} />
          <meshStandardMaterial color="#f0a8a0" roughness={0.7} />
        </mesh>
        {/* Horns */}
        <mesh
          position={[0.25, 0.36, -0.1]}
          rotation={[0.1, 0.2, 0.55]}
          castShadow
        >
          <cylinderGeometry args={[0.025, 0.008, 0.28, 8]} />
          <primitive object={materials.horn} attach="material" />
        </mesh>
        <mesh
          position={[-0.25, 0.36, -0.1]}
          rotation={[0.1, -0.2, -0.55]}
          castShadow
        >
          <cylinderGeometry args={[0.025, 0.008, 0.28, 8]} />
          <primitive object={materials.horn} attach="material" />
        </mesh>
      </group>

      {/* Legs */}
      {[
        [-0.38, 0, 0.68],
        [0.38, 0, 0.68],
        [-0.35, 0, -0.72],
        [0.35, 0, -0.72],
      ].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh position={[0, 0.42, 0]} castShadow>
            <cylinderGeometry args={[0.135, 0.115, 0.55, 14]} />
            <primitive object={materials.skin} attach="material" />
          </mesh>
          <mesh position={[0, 0.14, 0]}>
            <sphereGeometry args={[0.12, 12, 10]} />
            <primitive object={materials.skin} attach="material" />
          </mesh>
          <mesh position={[0, -0.18, 0]} castShadow>
            <cylinderGeometry args={[0.09, 0.075, 0.58, 12]} />
            <primitive object={materials.skin} attach="material" />
          </mesh>
          <mesh position={[0, -0.48, 0]}>
            <sphereGeometry args={[0.085, 10, 8]} />
            <primitive object={materials.skin} attach="material" />
          </mesh>
          <mesh position={[0, -0.62, 0.02]} castShadow>
            <cylinderGeometry args={[0.075, 0.09, 0.18, 14]} />
            <primitive object={materials.hoof} attach="material" />
          </mesh>
          <mesh position={[0, -0.62, 0.02]}>
            <boxGeometry args={[0.01, 0.2, 0.06]} />
            <meshStandardMaterial color="#1a0f08" />
          </mesh>
        </group>
      ))}

      {/* Udder */}
      <group position={[0, 0.08, -0.2]}>
        <mesh>
          <sphereGeometry args={[0.25, 14, 10]} />
          <primitive object={materials.udder} attach="material" />
        </mesh>
        {[
          [-0.1, -0.22, 0.08],
          [0.1, -0.22, 0.08],
          [-0.1, -0.22, -0.1],
          [0.1, -0.22, -0.1],
        ].map((p, i) => (
          <mesh
            key={i}
            position={p as [number, number, number]}
            rotation={[0.15, 0, 0]}
          >
            <cylinderGeometry args={[0.022, 0.016, 0.1, 8]} />
            <primitive object={materials.udder} attach="material" />
          </mesh>
        ))}
      </group>

      {/* Tail */}
      <group ref={tailRef} position={[0, 0.75, -1.1]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.04, 0.025, 0.55, 8]} />
          <primitive object={materials.skin} attach="material" />
        </mesh>
        <mesh position={[0, -0.34, 0]}>
          <sphereGeometry args={[0.09, 10, 8]} />
          <meshStandardMaterial color="#1a1108" roughness={0.95} />
        </mesh>
      </group>

      <IoTCollar />
    </group>
  );
}

// ─── Stable Lighting (no async HDR) ─────────────────────────────────────────

function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.55} color="#f5ead0" />
      <hemisphereLight args={["#c8e8a8", "#a07840", 0.45]} />
      {/* Key light (warm) */}
      <directionalLight
        position={[7, 11, 6]}
        intensity={2.0}
        color="#fff6e0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={30}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />
      {/* Cool fill from left */}
      <directionalLight
        position={[-5, 4, 3]}
        intensity={0.65}
        color="#cce0ff"
      />
      {/* Warm rim from behind */}
      <directionalLight
        position={[0, 3, -8]}
        intensity={0.45}
        color="#ffd8a0"
      />
      {/* Additional fill from below (ground bounce) */}
      <pointLight position={[0, -1, 0]} intensity={0.3} color="#d4b87a" />
    </>
  );
}

// ─── Grass Tufts (static, random but deterministic) ─────────────────────────

const GRASS = Array.from({ length: 65 }, (_, i) => {
  const angle = (i / 65) * Math.PI * 2 + i * 0.37;
  const radius = 2.8 + (i % 7) * 0.42;
  return {
    x: Math.cos(angle) * radius,
    z: Math.sin(angle) * radius,
    ry: (i * 1.3) % (Math.PI * 2),
    h: 0.08 + (i % 5) * 0.03,
  };
});

function GrassTufts() {
  return (
    <group position={[0, -0.62, 0]}>
      {GRASS.map((g, i) => (
        <mesh key={i} position={[g.x, g.h / 2, g.z]} rotation={[0, g.ry, 0]}>
          <cylinderGeometry args={[0.018, 0.035, g.h, 3]} />
          <meshStandardMaterial color="#5a7a3a" roughness={0.95} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Main Canvas (exported for dynamic import) ──────────────────────────────

export default function CowCanvas() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
      }}
      style={{ width: "100%", height: "100%" }}
    >
      <PerspectiveCamera makeDefault position={[4.8, 3.4, 5.8]} fov={42} />

      <SceneLights />
      <RealisticCow />
      <GrassTufts />

      {/* Floating particles (pollen/dust) */}
      <Sparkles
        count={180}
        scale={[8, 4, 8]}
        size={0.07}
        speed={0.25}
        color="#d4f0a0"
        opacity={0.35}
      />
      <Sparkles
        count={70}
        scale={[5, 2, 5]}
        size={0.04}
        speed={0.5}
        color="#ffe090"
        opacity={0.25}
      />

      {/* Ground plane with subtle texture */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.65, 0]}
        receiveShadow
      >
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#c8d8a0" roughness={0.95} metalness={0} />
      </mesh>

      <ContactShadows
        position={[0, -0.64, 0]}
        opacity={0.55}
        scale={10}
        blur={2.5}
        far={4}
        color="#2d1a05"
      />

      <OrbitControls
        enableZoom
        enablePan={false}
        zoomSpeed={0.7}
        rotateSpeed={0.75}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.1}
        minDistance={3}
        maxDistance={9}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
}
