import { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import GiftBox3D from "./GiftBox3D";
import Balloon3D from "./Balloon3D";
import { scrollState } from "../lib/scrollProgress";

const BALLOONS = [
  { color: "#E8583F", baseX: -1.4, baseZ: 0.2, speed: 1.1, offset: 0 },
  { color: "#D9A441", baseX: -0.6, baseZ: -0.4, speed: 0.9, offset: 1.3 },
  { color: "#163828", baseX: 0.7, baseZ: 0.3, speed: 1.3, offset: 2.4 },
  { color: "#E8583F", baseX: 1.5, baseZ: -0.2, speed: 1.0, offset: 3.6 },
];

function clamp01(v) {
  return Math.min(1, Math.max(0, v));
}

// remap une valeur de [a,b] vers [0,1], avec clamp
function remap(v, a, b) {
  return clamp01((v - a) / (b - a));
}

function SceneContent() {
  const openRef = useRef(0);
  const balloonRefs = useRef([]);
  const groupRef = useRef();
  const { camera } = useThree();

  useFrame((state) => {
    const p = scrollState.progress; // 0 -> 1 sur toute la page
    const t = state.clock.elapsedTime;

    // Phase 1 (0.02 -> 0.16) : la boîte s'ouvre
    const openProgress = remap(p, 0.02, 0.16);
    openRef.current = openProgress;

    // Phase 2 (0.1 -> 0.4) : la scène glisse vers la gauche, la caméra recule
    const shift = remap(p, 0.1, 0.4);
    if (groupRef.current) {
      groupRef.current.position.x = THREE.MathUtils.lerp(0, -1.6, shift);
    }
    camera.position.z = THREE.MathUtils.lerp(4.2, 6.2, shift);
    camera.position.y = THREE.MathUtils.lerp(0.4, 1.1, shift);
    camera.lookAt(0, 0, 0);

    // Phase 3 (0.55 -> 0.82) : tout s'estompe avant les sections catalogue/CTA
    const fade = 1 - remap(p, 0.55, 0.82);
    if (groupRef.current) {
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(0.7, 1, fade));
      groupRef.current.visible = fade > 0.01;
    }

    // Ballons : montée continue + petit flottement, s'écartent en s'envolant
    const flyAway = remap(p, 0.16, 0.4);
    balloonRefs.current.forEach((ref, i) => {
      if (!ref) return;
      const b = BALLOONS[i];
      const rise = openProgress * (1.4 + i * 0.3) + flyAway * 2.2;
      ref.position.y = -0.3 + rise + Math.sin(t * b.speed + b.offset) * 0.05;
      ref.position.x = b.baseX * (1 + flyAway * 0.6);
      ref.rotation.z = Math.sin(t * 0.6 + b.offset) * 0.08;
    });
  });

  return (
    <group ref={groupRef}>
      <GiftBox3D openRef={openRef} position={[0, -0.2, 0]} />
      {BALLOONS.map((b, i) => (
        <group key={i} ref={(el) => (balloonRefs.current[i] = el)} position={[b.baseX, -0.3, b.baseZ]}>
          <Balloon3D color={b.color} scale={0.85} />
        </group>
      ))}
      <ContactShadows position={[0, -0.75, 0]} opacity={0.35} scale={6} blur={2.5} far={2} />
    </group>
  );
}

export default function ScrollScene() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas shadows camera={{ position: [0, 0.4, 4.2], fov: 42 }} dpr={[1, 1.8]}>
        <color attach="background" args={["#FBF6EC"]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 5, 2]} intensity={1.4} castShadow shadow-mapSize={[1024, 1024]} />
        <Suspense fallback={null}>
          <Environment preset="apartment" />
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
