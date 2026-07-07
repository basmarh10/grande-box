import { useMemo } from "react";
import * as THREE from "three";

// Un ballon 3D "réaliste" : sphère légèrement étirée + noeud + ficelle.
// Le matériau physique (clearcoat) imite le fini satiné du latex sous la lumière.
export default function Balloon3D({
  color = "#F2A9B4",
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  stringLength = 1.4,
}) {
  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color,
        roughness: 0.18,
        metalness: 0,
        clearcoat: 1,
        clearcoatRoughness: 0.12,
        sheen: 1,
        sheenColor: new THREE.Color(color).lerp(new THREE.Color("#ffffff"), 0.6),
        sheenRoughness: 0.6,
      }),
    [color]
  );

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* corps du ballon, étiré verticalement comme un vrai ballon gonflé */}
      <mesh material={material} castShadow receiveShadow scale={[1, 1.22, 1]}>
        <sphereGeometry args={[0.5, 48, 48]} />
      </mesh>

      {/* noeud */}
      <mesh material={material} position={[0, -0.62, 0]}>
        <coneGeometry args={[0.09, 0.16, 16]} />
      </mesh>

      {/* ficelle */}
      <mesh position={[0, -0.62 - stringLength / 2, 0]}>
        <cylinderGeometry args={[0.006, 0.006, stringLength, 6]} />
        <meshStandardMaterial color="#7a6f5c" roughness={0.8} />
      </mesh>
    </group>
  );
}
