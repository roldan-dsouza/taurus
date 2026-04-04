// _CowCanvas.tsx
// Dancing cow with full choreography.

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  PerspectiveCamera,
  OrbitControls,
  RoundedBox,
  Sparkles,
} from "@react-three/drei";
import * as THREE from "three";

// ─── IoT Collar ───────────────────────────────────────────────────────────────

function IoTCollar() {
  const ledMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const glowRef = useRef<THREE.PointLight>(null);
  const antennaRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Blink in time with the dance beat (~120 BPM = 0.5s per beat)
    const beat = t % 0.5;
    const blink = beat < 0.08 ? 1 : 0;
    if (ledMatRef.current) ledMatRef.current.emissiveIntensity = blink * 4;
    if (glowRef.current) glowRef.current.intensity = blink * 2;
    if (antennaRef.current)
      antennaRef.current.rotation.z = Math.sin(t * 12) * 0.12;
  });

  return (
    <group position={[0, 1.2324, 1]} rotation={[-0.9, 0, 0]}>
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
        <mesh position={[-0.065, -0.05, 0.066]}>
          <sphereGeometry args={[0.012, 12, 12]} />
          <meshStandardMaterial
            color="#f59e0b"
            emissive="#f59e0b"
            emissiveIntensity={1.2}
          />
        </mesh>
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

// ─── Dancing Cow ──────────────────────────────────────────────────────────────

function DancingCow() {
  // Root refs
  const rootRef = useRef<THREE.Group>(null); // whole body bounce + sway
  const bodyRef = useRef<THREE.Group>(null); // torso twist
  const headRef = useRef<THREE.Group>(null); // head bob + nod
  const hipRef = useRef<THREE.Group>(null); // hip wiggle
  const tailRef = useRef<THREE.Group>(null); // tail wag
  const earLRef = useRef<THREE.Mesh>(null);
  const earRRef = useRef<THREE.Mesh>(null);
  const eyeLRef = useRef<THREE.Mesh>(null);
  const eyeRRef = useRef<THREE.Mesh>(null);

  // Per-leg refs [FL, FR, BL, BR]
  const legRefs = [
    useRef<THREE.Group>(null),
    useRef<THREE.Group>(null),
    useRef<THREE.Group>(null),
    useRef<THREE.Group>(null),
  ];

  // BPM = 120 → period = 0.5s
  const BPM = 120;
  const BEAT = 60 / BPM; // 0.5

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const b = (t / BEAT) * Math.PI * 2; // phase in radians synced to beat

    // ── Whole body bounce (every beat, up-down)
    if (rootRef.current) {
      rootRef.current.position.y = Math.abs(Math.sin(b)) * 0.1;
      // Side-to-side sway (every 2 beats)
      rootRef.current.rotation.z = Math.sin(b * 0.5) * 0.06;
    }

    // ── Torso twist (every beat)
    if (bodyRef.current) {
      bodyRef.current.rotation.y = Math.sin(b) * 0.08;
    }

    // ── Head bob (every beat) + slight nod (every 2 beats)
    if (headRef.current) {
      headRef.current.position.y = 1.82 + Math.abs(Math.sin(b)) * 0.06;
      headRef.current.rotation.x = Math.sin(b * 0.5) * 0.12;
      headRef.current.rotation.z = Math.sin(b) * 0.05;
    }

    // ── Hip wiggle (every beat, opposite phase to torso)
    if (hipRef.current) {
      hipRef.current.rotation.y = -Math.sin(b) * 0.12;
      hipRef.current.rotation.z = Math.sin(b) * 0.04;
    }

    // ── Tail wag fast (every half-beat)
    if (tailRef.current) {
      tailRef.current.rotation.z = Math.sin(b * 2) * 0.55;
      tailRef.current.rotation.x = 0.3 + Math.sin(b) * 0.2;
    }

    // ── Ears flap to the beat
    if (earLRef.current)
      earLRef.current.rotation.z = 0.3 + Math.sin(b * 2) * 0.18;
    if (earRRef.current)
      earRRef.current.rotation.z = -0.3 - Math.sin(b * 2) * 0.18;

    // ── Eyes wide open while dancing (occasional excited squint)
    if (eyeLRef.current && eyeRRef.current) {
      const excited = Math.sin(b * 4) > 0.9 ? 0.03 : 0.075;
      eyeLRef.current.scale.y = excited;
      eyeRRef.current.scale.y = excited;
    }

    // ── Leg stomp choreography
    // FL & BR lift together (beat 1), FR & BL lift together (beat 2)
    // offset phases: FL=0, BR=0, FR=π, BL=π
    const legPhases = [0, Math.PI, Math.PI, 0]; // FL, FR, BL, BR
    legRefs.forEach((ref, i) => {
      if (ref.current) {
        const lift = Math.max(0, Math.sin(b + legPhases[i])) * 0.18;
        ref.current.position.y = lift;
        // Kick outward slightly on lift
        ref.current.rotation.x = Math.sin(b + legPhases[i]) * 0.12;
      }
    });
  });

  const materials = useMemo(
    () => ({
      skin: new THREE.MeshStandardMaterial({
        color: "#f5f0e8",
        roughness: 0.88,
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

  const M = ({ o }: { o: THREE.Material }) => (
    <primitive object={o} attach="material" />
  );

  const LEG_POSITIONS: [number, number, number][] = [
    [-0.38, 0, 0.68],
    [0.38, 0, 0.68],
    [-0.35, 0, -0.72],
    [0.35, 0, -0.72],
  ];

  return (
    // rootRef drives bounce + sway
    <group ref={rootRef}>
      {/* bodyRef drives torso twist */}
      <group ref={bodyRef}>
        {/* ── Body ── */}
        <RoundedBox
          args={[1.05, 1.05, 2.1]}
          radius={0.22}
          smoothness={5}
          position={[0, 0.72, 0]}
          castShadow
        >
          <M o={materials.skin} />
        </RoundedBox>
        <mesh position={[0, 0.65, 0.86]} castShadow>
          <sphereGeometry args={[0.52, 20, 20]} />
          <M o={materials.skin} />
        </mesh>
        <mesh position={[0, 0.28, 0.05]} castShadow>
          <sphereGeometry args={[0.42, 16, 12]} />
          <M o={materials.skin} />
        </mesh>

        {/* ── Spots ── */}
        <RoundedBox
          args={[0.55, 0.52, 0.75]}
          radius={0.12}
          position={[0.38, 0.85, 0.15]}
          rotation={[0.1, 0.2, 0.05]}
        >
          {" "}
          <M o={materials.spot} />
        </RoundedBox>
        <RoundedBox
          args={[0.42, 0.38, 0.55]}
          radius={0.1}
          position={[-0.42, 0.65, -0.45]}
          rotation={[-0.05, -0.15, 0.1]}
        >
          {" "}
          <M o={materials.spot} />
        </RoundedBox>
        <RoundedBox
          args={[0.3, 0.28, 0.4]}
          radius={0.08}
          position={[0.3, 0.5, -0.7]}
        >
          {" "}
          <M o={materials.spot} />
        </RoundedBox>

        {/* ── Neck ── */}
        <RoundedBox
          args={[0.52, 0.78, 0.55]}
          radius={0.14}
          smoothness={4}
          position={[0, 1.22, 0.82]}
          rotation={[-0.52, 0, 0]}
          castShadow
        >
          <M o={materials.skin} />
        </RoundedBox>
        <mesh position={[0, 0.78, 0.95]} rotation={[-0.3, 0, 0]} castShadow>
          <sphereGeometry args={[0.22, 12, 10]} />
          <M o={materials.skin} />
        </mesh>

        {/* ── Head ── */}
        <group ref={headRef} position={[0, 1.82, 1.35]}>
          <RoundedBox
            args={[0.65, 0.62, 0.78]}
            radius={0.13}
            smoothness={5}
            castShadow
          >
            <M o={materials.skin} />
          </RoundedBox>
          <mesh position={[0.22, 0, 0.1]}>
            <sphereGeometry args={[0.25, 12, 10]} />
            <M o={materials.skin} />
          </mesh>
          <mesh position={[-0.22, 0, 0.1]}>
            <sphereGeometry args={[0.25, 12, 10]} />
            <M o={materials.skin} />
          </mesh>
          <RoundedBox
            args={[0.46, 0.36, 0.34]}
            radius={0.1}
            position={[0, -0.17, 0.45]}
            castShadow
          >
            <M o={materials.nose} />
          </RoundedBox>
          <mesh position={[0.1, -0.185, 0.63]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.042, 0.038, 0.022, 12]} />
            <meshStandardMaterial color="#c06050" roughness={0.8} />
          </mesh>
          <mesh position={[-0.1, -0.185, 0.63]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.042, 0.038, 0.022, 12]} />
            <meshStandardMaterial color="#c06050" roughness={0.8} />
          </mesh>
          {/* Eyes */}
          <group position={[0.27, 0.12, 0.35]}>
            <mesh>
              <sphereGeometry args={[0.075, 16, 16]} />
              <M o={materials.eye} />
            </mesh>
            <mesh ref={eyeLRef} position={[0.02, 0.03, 0.065]}>
              <sphereGeometry args={[0.018, 8, 8]} />
              <M o={materials.shine} />
            </mesh>
            <mesh position={[0, 0.04, 0.06]} rotation={[0.2, 0, 0]}>
              <torusGeometry args={[0.062, 0.013, 6, 16, Math.PI]} />
              <M o={materials.skin} />
            </mesh>
          </group>
          <group position={[-0.27, 0.12, 0.35]}>
            <mesh>
              <sphereGeometry args={[0.075, 16, 16]} />
              <M o={materials.eye} />
            </mesh>
            <mesh ref={eyeRRef} position={[-0.02, 0.03, 0.065]}>
              <sphereGeometry args={[0.018, 8, 8]} />
              <M o={materials.shine} />
            </mesh>
            <mesh position={[0, 0.04, 0.06]} rotation={[0.2, 0, 0]}>
              <torusGeometry args={[0.062, 0.013, 6, 16, Math.PI]} />
              <M o={materials.skin} />
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
            <M o={materials.skin} />
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
            <M o={materials.skin} />
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
            <M o={materials.horn} />
          </mesh>
          <mesh
            position={[-0.25, 0.36, -0.1]}
            rotation={[0.1, -0.2, -0.55]}
            castShadow
          >
            <cylinderGeometry args={[0.025, 0.008, 0.28, 8]} />
            <M o={materials.horn} />
          </mesh>
        </group>

        {/* ── Front Legs (attached to body, stomp independently) ── */}
        {LEG_POSITIONS.slice(0, 2).map((pos, i) => (
          <group key={i} ref={legRefs[i]} position={pos}>
            <mesh position={[0, 0.42, 0]} castShadow>
              <cylinderGeometry args={[0.135, 0.115, 0.55, 14]} />
              <M o={materials.skin} />
            </mesh>
            <mesh position={[0, 0.14, 0]}>
              <sphereGeometry args={[0.12, 12, 10]} />
              <M o={materials.skin} />
            </mesh>
            <mesh position={[0, -0.18, 0]} castShadow>
              <cylinderGeometry args={[0.09, 0.075, 0.58, 12]} />
              <M o={materials.skin} />
            </mesh>
            <mesh position={[0, -0.48, 0]}>
              <sphereGeometry args={[0.085, 10, 8]} />
              <M o={materials.skin} />
            </mesh>
            <mesh position={[0, -0.62, 0.02]} castShadow>
              <cylinderGeometry args={[0.075, 0.09, 0.18, 14]} />
              <M o={materials.hoof} />
            </mesh>
            <mesh position={[0, -0.62, 0.02]}>
              <boxGeometry args={[0.01, 0.2, 0.06]} />
              <meshStandardMaterial color="#1a0f08" />
            </mesh>
          </group>
        ))}

        {/* ── Hip group (drives back half wiggle) ── */}
        <group ref={hipRef}>
          <RoundedBox
            args={[0.95, 0.93, 0.68]}
            radius={0.18}
            smoothness={4}
            position={[0, 0.78, -0.86]}
            castShadow
          >
            <M o={materials.skin} />
          </RoundedBox>

          {/* Back Legs */}
          {LEG_POSITIONS.slice(2).map((pos, i) => (
            <group key={i} ref={legRefs[i + 2]} position={pos}>
              <mesh position={[0, 0.42, 0]} castShadow>
                <cylinderGeometry args={[0.135, 0.115, 0.55, 14]} />
                <M o={materials.skin} />
              </mesh>
              <mesh position={[0, 0.14, 0]}>
                <sphereGeometry args={[0.12, 12, 10]} />
                <M o={materials.skin} />
              </mesh>
              <mesh position={[0, -0.18, 0]} castShadow>
                <cylinderGeometry args={[0.09, 0.075, 0.58, 12]} />
                <M o={materials.skin} />
              </mesh>
              <mesh position={[0, -0.48, 0]}>
                <sphereGeometry args={[0.085, 10, 8]} />
                <M o={materials.skin} />
              </mesh>
              <mesh position={[0, -0.62, 0.02]} castShadow>
                <cylinderGeometry args={[0.075, 0.09, 0.18, 14]} />
                <M o={materials.hoof} />
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
              <M o={materials.udder} />
            </mesh>
            {(
              [
                [-0.1, -0.22, 0.08],
                [0.1, -0.22, 0.08],
                [-0.1, -0.22, -0.1],
                [0.1, -0.22, -0.1],
              ] as [number, number, number][]
            ).map((p, i) => (
              <mesh key={i} position={p} rotation={[0.15, 0, 0]}>
                <cylinderGeometry args={[0.022, 0.016, 0.1, 8]} />
                <M o={materials.udder} />
              </mesh>
            ))}
          </group>

          {/* Tail */}
          <group ref={tailRef} position={[0, 0.75, -1.1]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.04, 0.025, 0.55, 8]} />
              <M o={materials.skin} />
            </mesh>
            <mesh position={[0, -0.34, 0]}>
              <sphereGeometry args={[0.09, 10, 8]} />
              <meshStandardMaterial color="#1a1108" roughness={0.95} />
            </mesh>
          </group>
        </group>

        <IoTCollar />
      </group>
    </group>
  );
}

// ─── Lighting ─────────────────────────────────────────────────────────────────

function SceneLights() {
  // Disco-style colour cycling point lights
  const discoBL = useRef<THREE.PointLight>(null);
  const discoBR = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (discoBL.current) {
      discoBL.current.color.setHSL((t * 0.15) % 1, 0.9, 0.55);
      discoBL.current.intensity = 0.6 + Math.sin(t * 6) * 0.3;
    }
    if (discoBR.current) {
      discoBR.current.color.setHSL((t * 0.15 + 0.5) % 1, 0.9, 0.55);
      discoBR.current.intensity = 0.6 + Math.cos(t * 6) * 0.3;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} color="#f5ead0" />
      <hemisphereLight
        args={[
          "#c8e8a8",
          "#a07840" as unknown as THREE.ColorRepresentation,
          0.4,
        ]}
      />
      <directionalLight
        position={[7, 11, 6]}
        intensity={1.8}
        color="#fff6e0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={30}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />
      <directionalLight position={[-5, 4, 3]} intensity={0.5} color="#cce0ff" />
      {/* Animated disco lights */}
      <pointLight
        ref={discoBL}
        position={[-3, 4, 2]}
        intensity={0.8}
        distance={10}
        decay={2}
      />
      <pointLight
        ref={discoBR}
        position={[3, 4, 2]}
        intensity={0.8}
        distance={10}
        decay={2}
      />
    </>
  );
}

// ─── Grass ────────────────────────────────────────────────────────────────────

const GRASS = Array.from({ length: 65 }, (_, i) => ({
  x: Math.cos((i / 65) * Math.PI * 2 + i * 0.37) * (2.8 + (i % 7) * 0.42),
  z: Math.sin((i / 65) * Math.PI * 2 + i * 0.37) * (2.8 + (i % 7) * 0.42),
  ry: (i * 1.3) % (Math.PI * 2),
  h: 0.08 + (i % 5) * 0.03,
}));

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

// ─── Canvas ───────────────────────────────────────────────────────────────────

export default function CowCanvas() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.15,
      }}
      style={{ width: "100%", height: "100%" }}
    >
      <PerspectiveCamera makeDefault position={[4.8, 3.4, 5.8]} fov={42} />
      <SceneLights />
      <DancingCow />
      <GrassTufts />

      {/* Extra sparkles for the dance party */}
      <Sparkles
        count={220}
        scale={[9, 5, 9]}
        size={0.09}
        speed={0.6}
        color="#d4f0a0"
        opacity={0.4}
      />
      <Sparkles
        count={100}
        scale={[6, 3, 6]}
        size={0.05}
        speed={1.0}
        color="#ffb0f0"
        opacity={0.3}
      />
      <Sparkles
        count={60}
        scale={[4, 2, 4]}
        size={0.04}
        speed={1.5}
        color="#ffe090"
        opacity={0.35}
      />

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
        opacity={0.5}
        scale={10}
        blur={3}
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
        autoRotateSpeed={1.5}
      />
    </Canvas>
  );
}
