import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import GiftBox3D from "./GiftBox3D";
import Balloon3D from "./Balloon3D";
import Confetti from "./Confetti";
import BoxContents from "./BoxContents";

/*
 * Scène 3D interactive de la fiche produit.
 * Clic sur la boîte : le couvercle s'ouvre, des ballons s'élèvent de
 * l'intérieur et un burst de confettis part du cœur de la boîte.
 * Nouveau clic : tout se referme. Style Spline recréé en R3F
 * (arêtes arrondies + laque glossy), aucun asset externe.
 */
const BALLOON_SET = [
  { x: -0.55, z: 0.15, scale: 0.34, delay: 0.0 },
  { x: 0.5, z: -0.2, scale: 0.3, delay: 0.12 },
  { x: 0.05, z: 0.4, scale: 0.27, delay: 0.24 },
  { x: -0.25, z: -0.45, scale: 0.24, delay: 0.34 },
  { x: 0.75, z: 0.35, scale: 0.22, delay: 0.44 },
];

function BALLOON_COLORS(ribbonColor) {
  return [ribbonColor, "#FF6FA0", "#2EC4B6", "#FFC93C", "#8E5FD1"];
}

function Scene({ boxColor, ribbonColor, openTarget, onToggle }) {
  const openRef = useRef(0);        // valeur animée 0 -> 1
  const groupRef = useRef();
  const balloonRefs = useRef([]);
  const confettiFire = useRef(null);
  const confettiDone = useRef(false);

  useFrame((state, delta) => {
    // ouverture amortie (ressort doux, jamais saccadé)
    openRef.current = THREE.MathUtils.damp(openRef.current, openTarget, 5, delta);
    const o = openRef.current;

    // burst de confettis quand le couvercle décolle
    if (openTarget === 1 && o > 0.35 && !confettiDone.current) {
      confettiDone.current = true;
      confettiFire.current?.();
    }
    if (openTarget === 0 && o < 0.1) confettiDone.current = false;

    // tilt doux : la boîte suit la souris + respiration légère
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      const targetY = state.pointer.x * 0.35 + Math.sin(t * 0.4) * 0.06;
      const targetX = -state.pointer.y * 0.12;
      groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetY, 4, delta);
      groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetX, 4, delta);
      groupRef.current.position.y = Math.sin(t * 0.8) * 0.03 - 0.5;
    }

    // ballons : sortent de la boîte, montent et flottent
    balloonRefs.current.forEach((ref, i) => {
      if (!ref) return;
      const b = BALLOON_SET[i];
      const local = clampDelay(o, b.delay);
      const rise = local * (1.5 + i * 0.28);
      ref.visible = local > 0.02;
      ref.position.set(
        b.x * (0.4 + local),
        -0.1 + rise + Math.sin(t * (1 + i * 0.2) + i * 1.7) * 0.07 * local,
        b.z * (0.4 + local)
      );
      ref.scale.setScalar(Math.max(0.001, easeOutBack(local)) * 1);
      ref.rotation.z = Math.sin(t * 0.8 + i) * 0.09 * local;
    });
  });

  return (
    <group>
      <group
        ref={groupRef}
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
        onPointerOver={() => { document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { document.body.style.cursor = "auto"; }}
      >
        <GiftBox3D openRef={openRef} boxColor={boxColor} ribbonColor={ribbonColor} lidDrift={0.3} />
        {/* contenu intérieur partagé avec la home : mini-cadeaux, rubans,
            sparkles — plus jamais un panneau plat vide */}
        <BoxContents openRef={openRef} position={[0, 0.5, 0]} />
        {BALLOON_SET.map((b, i) => (
          <group key={i} ref={(el) => (balloonRefs.current[i] = el)} visible={false}>
            <Balloon3D color={BALLOON_COLORS(ribbonColor)[i]} scale={b.scale} stringLength={0.6} />
          </group>
        ))}
        <Confetti fireRef={confettiFire} origin={[0, 0.7, 0]} />
      </group>
      <ContactShadows position={[0, -1.15, 0]} opacity={0.35} scale={5} blur={2.4} far={2} />
    </group>
  );
}

// progression locale d'un ballon, décalée puis re-normalisée
function clampDelay(v, delay) {
  return Math.min(1, Math.max(0, (v - delay) / (1 - delay)));
}
function easeOutBack(x) {
  const c1 = 1.70158, c3 = c1 + 1;
  return Math.min(1.15, 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2));
}

export default function ProductScene3D({ boxColor = "#D6252E", ribbonColor = "#D9A441" }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full aspect-[4/5]">
      <Canvas
        shadows
        camera={{ position: [0, 0.85, 5.6], fov: 40 }}
        dpr={[1, 1.8]}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.55} />
        <hemisphereLight args={["#fff8ec", "#e8d9bd", 1.1]} />
        <directionalLight
          position={[3, 5, 2]}
          intensity={1.5}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0004}
          shadow-normalBias={0.06}
        />
        <pointLight position={[-4, 2.5, 3]} intensity={14} color="#FFF3E0" />
        <pointLight position={[0, 3, -4]} intensity={10} color="#FFE8EC" />
        <spotLight position={[0, 1.6, 5.5]} angle={0.7} penumbra={1} intensity={20} />
        <Suspense fallback={null}>
          <Scene
            boxColor={boxColor}
            ribbonColor={ribbonColor}
            openTarget={open ? 1 : 0}
            onToggle={() => setOpen((v) => !v)}
          />
        </Suspense>
      </Canvas>
      <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-medium tracking-wide uppercase text-ink/50 bg-ivory/80 backdrop-blur px-4 py-1.5 rounded-full whitespace-nowrap">
        {open ? "Cliquez pour refermer" : "Cliquez sur la boîte pour l'ouvrir 🎈"}
      </p>
    </div>
  );
}
