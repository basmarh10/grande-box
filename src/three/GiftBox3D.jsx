import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

/*
 * Boîte cadeau 3D — style « Spline » recréé en R3F :
 * arêtes arrondies (RoundedBox), matériaux laqués (clearcoat fort),
 * ruban satiné brillant et nœud en vraies boucles pleines.
 * Aucune dépendance à un fichier .splinecode : tout est généré ici.
 */

// Boucle de ruban « en goutte » : part du centre du nœud, s'élève,
// s'arrondit vers l'extérieur puis revient au centre.
function makeBowLoopGeometry(side = 1) {
  const pts = [
    new THREE.Vector3(0, 0.02, 0),
    new THREE.Vector3(side * 0.18, 0.2, 0.03),
    new THREE.Vector3(side * 0.36, 0.14, 0),
    new THREE.Vector3(side * 0.34, -0.05, -0.03),
    new THREE.Vector3(side * 0.13, -0.04, 0),
  ];
  const curve = new THREE.CatmullRomCurve3(pts, true, "catmullrom", 0.65);
  return new THREE.TubeGeometry(curve, 56, 0.055, 14, true);
}

// Pan de ruban qui retombe du nœud le long du couvercle.
function makeTailGeometry(side = 1) {
  const pts = [
    new THREE.Vector3(0, 0.02, 0),
    new THREE.Vector3(side * 0.12, -0.14, 0.08),
    new THREE.Vector3(side * 0.22, -0.3, 0.12),
  ];
  const curve = new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.5);
  return new THREE.TubeGeometry(curve, 28, 0.04, 12, false);
}

/*
 * `openRef.current` (0 -> 1) pilote l'ouverture : le couvercle se soulève
 * et pivote, les boucles du nœud s'écartent. On lit une ref (pas une prop)
 * pour animer à 60 fps sans re-render React.
 */
export default function GiftBox3D({
  openRef,
  boxColor = "#D6252E",
  ribbonColor = "#D9A441",
  position = [0, 0, 0],
}) {
  const lidRef = useRef();
  const bowLeftRef = useRef();
  const bowRightRef = useRef();

  const bowLeftGeo = useMemo(() => makeBowLoopGeometry(-1), []);
  const bowRightGeo = useMemo(() => makeBowLoopGeometry(1), []);
  const tailLeftGeo = useMemo(() => makeTailGeometry(-1), []);
  const tailRightGeo = useMemo(() => makeTailGeometry(1), []);

  // Carton laqué : brillant, reflets nets, léger voile nacré.
  const boxMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: boxColor,
        roughness: 0.16,
        metalness: 0.04,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        sheen: 0.4,
        sheenColor: new THREE.Color("#ffffff"),
        sheenRoughness: 0.5,
      }),
    [boxColor]
  );

  // Ruban satin : plus métallique, très glossy.
  const ribbonMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: ribbonColor,
        roughness: 0.14,
        metalness: 0.45,
        clearcoat: 1,
        clearcoatRoughness: 0.06,
      }),
    [ribbonColor]
  );

  useFrame(() => {
    const openProgress = openRef?.current ?? 0;
    if (lidRef.current) {
      lidRef.current.position.y = 0.62 + openProgress * 1.15;
      lidRef.current.rotation.z = openProgress * -0.4;
      lidRef.current.rotation.x = openProgress * 0.12;
    }
    if (bowLeftRef.current && bowRightRef.current) {
      bowLeftRef.current.rotation.y = openProgress * 0.5;
      bowRightRef.current.rotation.y = openProgress * -0.5;
      bowLeftRef.current.rotation.z = openProgress * 0.35;
      bowRightRef.current.rotation.z = openProgress * -0.35;
    }
  });

  return (
    <group position={position}>
      {/* base : arêtes arrondies */}
      <RoundedBox args={[1.6, 1.1, 1.6]} radius={0.09} smoothness={5} material={boxMaterial} castShadow receiveShadow />

      {/* rubans croisés sur la base */}
      <RoundedBox args={[0.24, 1.13, 1.63]} radius={0.045} smoothness={4} material={ribbonMaterial} position={[0, 0, 0]} />
      <RoundedBox args={[0.24, 1.13, 1.63]} radius={0.045} smoothness={4} material={ribbonMaterial} rotation={[0, Math.PI / 2, 0]} />

      {/* couvercle (animé par openProgress) */}
      <group ref={lidRef} position={[0, 0.62, 0]}>
        <RoundedBox args={[1.74, 0.3, 1.74]} radius={0.08} smoothness={5} material={boxMaterial} castShadow />
        <RoundedBox args={[0.28, 0.33, 1.77]} radius={0.05} smoothness={4} material={ribbonMaterial} position={[0, 0.01, 0]} />
        <RoundedBox args={[0.28, 0.33, 1.77]} radius={0.05} smoothness={4} material={ribbonMaterial} position={[0, 0.01, 0]} rotation={[0, Math.PI / 2, 0]} />

        {/* nœud : boucles pleines + pans + cœur */}
        <group position={[0, 0.28, 0]}>
          <mesh ref={bowLeftRef} material={ribbonMaterial} geometry={bowLeftGeo} castShadow />
          <mesh ref={bowRightRef} material={ribbonMaterial} geometry={bowRightGeo} castShadow />
          <mesh material={ribbonMaterial} geometry={tailLeftGeo} position={[0, -0.02, 0.03]} />
          <mesh material={ribbonMaterial} geometry={tailRightGeo} position={[0, -0.02, 0.03]} />
          <mesh material={ribbonMaterial}>
            <sphereGeometry args={[0.105, 20, 20]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
