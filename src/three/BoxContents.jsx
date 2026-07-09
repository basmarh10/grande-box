import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Sparkles } from "@react-three/drei";
import * as THREE from "three";

/*
 * Contenu intérieur de la boîte cadeau — composant PARTAGÉ entre la scène
 * de la home (ScrollScene) et la fiche produit (ProductScene3D) : une seule
 * implémentation, comme demandé.
 *
 * Révélé par `openRef` (0 -> 1) : papier de soie, 2-3 mini-cadeaux aux
 * couleurs de la palette, boucles de ruban qui dépassent, et sparkles qui
 * captent la lumière. Tout est généré en code, aucun asset externe.
 */

const MINI_GIFTS = [
  { pos: [-0.38, 0.3, 0.1], size: 0.4, color: "#2EC4B6", ribbon: "#E8B84B", rotY: 0.4 },
  { pos: [0.34, 0.34, -0.18], size: 0.46, color: "#FFC93C", ribbon: "#F0483D", rotY: -0.3 },
  { pos: [0.05, 0.24, 0.38], size: 0.32, color: "#FF6FA0", ribbon: "#FFFDF8", rotY: 0.9 },
];

function MiniGift({ pos, size, color, ribbon, rotY }) {
  const boxMat = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color, roughness: 0.2, clearcoat: 0.9, clearcoatRoughness: 0.1 }),
    [color]
  );
  const ribMat = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color: ribbon, roughness: 0.15, metalness: 0.35, clearcoat: 1 }),
    [ribbon]
  );
  return (
    <group position={pos} rotation={[0, rotY, 0]}>
      <RoundedBox args={[size, size, size]} radius={size * 0.14} smoothness={4} material={boxMat} castShadow />
      <RoundedBox args={[size * 0.18, size * 1.03, size * 1.03]} radius={size * 0.05} smoothness={3} material={ribMat} />
      <RoundedBox args={[size * 0.18, size * 1.03, size * 1.03]} radius={size * 0.05} smoothness={3} material={ribMat} rotation={[0, Math.PI / 2, 0]} />
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

  const tissueMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#FFFDF8", roughness: 0.95 }),
    []
  );

  useFrame(() => {
    const o = openRef?.current ?? 0;
    if (!groupRef.current) return;
    // le contenu monte de l'intérieur dès que le couvercle se soulève
    groupRef.current.visible = o > 0.03;
    groupRef.current.position.y = position[1] - 0.35 + o * 0.62;
    const s = 0.4 + Math.min(1, o * 1.4) * 0.6;
    groupRef.current.scale.setScalar(s);
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

      {/* mini-cadeaux */}
      {MINI_GIFTS.map((g, i) => (
        <MiniGift key={i} {...g} />
      ))}

      {/* boucles de ruban qui dépassent */}
      <RibbonLoop position={[-0.15, 0.28, -0.35]} rotation={[0.3, 0.6, 0.2]} />
      <RibbonLoop position={[0.5, 0.22, 0.3]} rotation={[-0.2, -0.4, -0.3]} scale={0.8} color="#FF6FA0" />

      {/* sparkles : points de lumière qui scintillent au-dessus du contenu */}
      <Sparkles count={42} scale={[1.5, 0.9, 1.5]} position={[0, 0.45, 0]} size={3.2} speed={0.45} color="#FFE9A8" />
    </group>
  );
}
