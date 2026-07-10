import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Sparkles } from "@react-three/drei";
import * as THREE from "three";

/*
 * Contenu intérieur de la boîte cadeau — composant PARTAGÉ entre la home
 * (ScrollScene) et la fiche produit (ProductScene3D) : une seule
 * implémentation pour les deux.
 *
 * Révélé par `openRef` (0 -> 1) :
 * - papier de soie,
 * - mini-cadeaux « lucioles » AVEC nœud + ruban (comme la grande boîte),
 *   qui sortent un à un, lentement, puis FLOTTENT au-dessus de la boîte,
 * - boucles de ruban qui dépassent,
 * - sparkles qui captent la lumière.
 */

const MINI_GIFTS = [
  { x: -0.38, z: 0.1, size: 0.4, color: "#2EC4B6", ribbon: "#E8B84B", rotY: 0.4, reveal: 0.3, float: 0.5, speed: 0.8 },
  { x: 0.34, z: -0.18, size: 0.46, color: "#FFC93C", ribbon: "#F0483D", rotY: -0.3, reveal: 0.45, float: 0.75, speed: 0.65 },
  { x: 0.05, z: 0.38, size: 0.32, color: "#FF6FA0", ribbon: "#FFFDF8", rotY: 0.9, reveal: 0.6, float: 1.0, speed: 0.9 },
];

function clamp01(v) { return Math.min(1, Math.max(0, v)); }
function easeOutCubic(x) { return 1 - Math.pow(1 - x, 3); }

// Mini-cadeau avec ruban croisé ET nœud (deux boucles + cœur), comme la
// grande boîte — présent partout où l'effet apparaît (home + fiches produit).
function MiniGift({ size, color, ribbon }) {
  const boxMat = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color, roughness: 0.2, clearcoat: 0.9, clearcoatRoughness: 0.1 }),
    [color]
  );
  const ribMat = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color: ribbon, roughness: 0.15, metalness: 0.35, clearcoat: 1 }),
    [ribbon]
  );
  const loopR = size * 0.19;
  return (
    <group>
      <RoundedBox args={[size, size, size]} radius={size * 0.14} smoothness={4} material={boxMat} castShadow />
      {/* ruban croisé */}
      <RoundedBox args={[size * 0.18, size * 1.03, size * 1.03]} radius={size * 0.05} smoothness={3} material={ribMat} />
      <RoundedBox args={[size * 0.18, size * 1.03, size * 1.03]} radius={size * 0.05} smoothness={3} material={ribMat} rotation={[0, Math.PI / 2, 0]} />
      {/* nœud : deux boucles inclinées + cœur */}
      <group position={[0, size * 0.62, 0]}>
        <mesh material={ribMat} position={[-loopR * 0.9, 0, 0]} rotation={[Math.PI / 2, 0, 0.55]}>
          <torusGeometry args={[loopR, size * 0.055, 10, 24]} />
        </mesh>
        <mesh material={ribMat} position={[loopR * 0.9, 0, 0]} rotation={[Math.PI / 2, 0, -0.55]}>
          <torusGeometry args={[loopR, size * 0.055, 10, 24]} />
        </mesh>
        <mesh material={ribMat}>
          <sphereGeometry args={[size * 0.09, 14, 14]} />
        </mesh>
      </group>
    </group>
  );
}

// Boucle de ruban qui dépasse du papier de soie (demi-tore incliné).
function RibbonLoop({ position, rotation, scale = 1, color = "#E8B84B" }) {
  const mat = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color, roughness: 0.15, metalness: 0.4, clearcoat: 1, side: THREE.DoubleSide }),
    [color]
  );
  return (
    <mesh position={position} rotation={rotation} scale={scale} material={mat}>
      <torusGeometry args={[0.22, 0.045, 12, 32, Math.PI]} />
    </mesh>
  );
}

export default function BoxContents({ openRef, position = [0, 0, 0] }) {
  const groupRef = useRef();
  const giftRefs = useRef([]);

  const tissueMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#FFFDF8", roughness: 0.95 }),
    []
  );

  useFrame((state) => {
    const o = openRef?.current ?? 0;
    const t = state.clock.elapsedTime;
    if (!groupRef.current) return;

    // le papier de soie monte doucement de l'intérieur
    groupRef.current.visible = o > 0.03;
    groupRef.current.position.y = position[1] - 0.35 + easeOutCubic(o) * 0.62;
    const s = 0.4 + Math.min(1, o * 1.4) * 0.6;
    groupRef.current.scale.setScalar(s);

    // mini-cadeaux « lucioles » : chacun émerge à son tour (fenêtre lente),
    // monte au-dessus de la boîte puis flotte sur place en tournant doucement
    giftRefs.current.forEach((ref, i) => {
      if (!ref) return;
      const g = MINI_GIFTS[i];
      const local = easeOutCubic(clamp01((o - g.reveal) / (1 - g.reveal)));
      ref.visible = local > 0.01;
      const bob = Math.sin(t * g.speed + i * 2.1) * 0.07 * local;
      const swayX = Math.cos(t * g.speed * 0.7 + i * 1.4) * 0.05 * local;
      ref.position.set(g.x + swayX, 0.15 + local * g.float + bob, g.z);
      ref.rotation.y = g.rotY + t * 0.25 * local;
      ref.scale.setScalar(Math.max(0.001, local));
    });
  });

  return (
    <group ref={groupRef} position={position} visible={false}>
      {/* papier de soie : monticules irréguliers */}
      <mesh material={tissueMat} position={[0, 0, 0]} scale={[1.05, 0.35, 1.05]}>
        <sphereGeometry args={[0.62, 24, 16]} />
      </mesh>
      <mesh material={tissueMat} position={[-0.35, 0.05, 0.25]} scale={[0.55, 0.3, 0.55]}>
        <sphereGeometry args={[0.6, 20, 14]} />
      </mesh>
      <mesh material={tissueMat} position={[0.4, 0.04, -0.3]} scale={[0.5, 0.28, 0.5]}>
        <sphereGeometry args={[0.6, 20, 14]} />
      </mesh>

      {/* mini-cadeaux lucioles (avec nœud), animés dans useFrame */}
      {MINI_GIFTS.map((g, i) => (
        <group key={i} ref={(el) => (giftRefs.current[i] = el)} visible={false}>
          <MiniGift size={g.size} color={g.color} ribbon={g.ribbon} />
        </group>
      ))}

      {/* boucles de ruban qui dépassent */}
      <RibbonLoop position={[-0.15, 0.28, -0.35]} rotation={[0.3, 0.6, 0.2]} />
      <RibbonLoop position={[0.5, 0.22, 0.3]} rotation={[-0.2, -0.4, -0.3]} scale={0.8} color="#FF6FA0" />

      {/* sparkles : points de lumière qui scintillent au-dessus du contenu */}
      <Sparkles count={42} scale={[1.5, 1.2, 1.5]} position={[0, 0.6, 0]} size={3.2} speed={0.45} color="#FFE9A8" />
    </group>
  );
}
