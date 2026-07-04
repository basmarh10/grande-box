import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// La boîte 3D animée : `openRef.current` (0 -> 1) fait glisser le couvercle
// vers le haut et écarter le noeud, piloté depuis le scroll (voir ScrollScene).
// On lit une ref (plutôt qu'une prop) pour animer à 60fps sans re-render React.
export default function GiftBox3D({
  openRef,
  boxColor = "#163828",
  ribbonColor = "#D9A441",
  position = [0, 0, 0],
}) {
  const lidRef = useRef();
  const bowLeftRef = useRef();
  const bowRightRef = useRef();

  const boxMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: boxColor,
        roughness: 0.35,
        metalness: 0.05,
        clearcoat: 0.3,
        clearcoatRoughness: 0.4,
      }),
    [boxColor]
  );

  const ribbonMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: ribbonColor,
        roughness: 0.25,
        metalness: 0.4,
        clearcoat: 0.6,
      }),
    [ribbonColor]
  );

  useFrame(() => {
    const openProgress = openRef?.current ?? 0;
    if (lidRef.current) {
      // le couvercle monte et pivote légèrement en s'ouvrant
      lidRef.current.position.y = 0.55 + openProgress * 1.1;
      lidRef.current.rotation.z = openProgress * -0.35;
    }
    if (bowLeftRef.current && bowRightRef.current) {
      bowLeftRef.current.rotation.z = 0.5 + openProgress * 0.6;
      bowRightRef.current.rotation.z = -0.5 - openProgress * 0.6;
    }
  });

  return (
    <group position={position}>
      {/* base */}
      <mesh material={boxMaterial} castShadow receiveShadow>
        <boxGeometry args={[1.6, 1.1, 1.6]} />
      </mesh>

      {/* ruban vertical + horizontal sur la base */}
      <mesh material={ribbonMaterial} position={[0, 0.001, 0]}>
        <boxGeometry args={[0.22, 1.12, 1.62]} />
      </mesh>
      <mesh material={ribbonMaterial} position={[0, 0.001, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[0.22, 1.12, 1.62]} />
      </mesh>

      {/* couvercle (anime avec openProgress) */}
      <group ref={lidRef} position={[0, 0.55, 0]}>
        <mesh material={boxMaterial} castShadow>
          <boxGeometry args={[1.72, 0.28, 1.72]} />
        </mesh>
        <mesh material={ribbonMaterial} position={[0, 0.15, 0]}>
          <boxGeometry args={[0.26, 0.3, 1.74]} />
        </mesh>
        <mesh material={ribbonMaterial} position={[0, 0.15, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[0.26, 0.3, 1.74]} />
        </mesh>

        {/* noeud stylisé, s'écarte quand la boîte s'ouvre */}
        <group position={[0, 0.32, 0]}>
          <mesh ref={bowLeftRef} material={ribbonMaterial} position={[-0.18, 0, 0]}>
            <torusGeometry args={[0.16, 0.06, 12, 24, Math.PI * 1.4]} />
          </mesh>
          <mesh ref={bowRightRef} material={ribbonMaterial} position={[0.18, 0, 0]}>
            <torusGeometry args={[0.16, 0.06, 12, 24, Math.PI * 1.4]} />
          </mesh>
          <mesh material={ribbonMaterial}>
            <sphereGeometry args={[0.1, 16, 16]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
