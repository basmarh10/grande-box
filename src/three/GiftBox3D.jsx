import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Construit une boucle de ruban « en goutte » : part du centre du nœud,
// s'élève, s'arrondit vers l'extérieur puis revient au centre.
// TubeGeometry le long d'une CatmullRomCurve3 fermée = boucle pleine et
// nette, sans les artefacts des plans tordus (problème rencontré sur Spline).
function makeBowLoopGeometry(side = 1) {
  const pts = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(side * 0.16, 0.14, 0.02),
    new THREE.Vector3(side * 0.3, 0.1, 0),
    new THREE.Vector3(side * 0.3, -0.06, -0.02),
    new THREE.Vector3(side * 0.12, -0.05, 0),
  ];
  const curve = new THREE.CatmullRomCurve3(pts, true, "catmullrom", 0.6);
  return new THREE.TubeGeometry(curve, 48, 0.045, 12, true);
}

// Pan de ruban qui retombe du nœud le long du couvercle.
function makeTailGeometry(side = 1) {
  const pts = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(side * 0.1, -0.12, 0.06),
    new THREE.Vector3(side * 0.2, -0.26, 0.1),
  ];
  const curve = new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.5);
  return new THREE.TubeGeometry(curve, 24, 0.035, 10, false);
}

// La boîte 3D animée : `openRef.current` (0 -> 1) fait glisser le couvercle
// vers le haut et écarter le noeud, piloté depuis le scroll (voir ScrollScene).
// On lit une ref (plutôt qu'une prop) pour animer à 60fps sans re-render React.
export default function GiftBox3D({
  openRef,
  boxColor = "#D6252E",
  ribbonColor = "#D9A441",
  position = [0, 0, 0],
}) {
  const lidRef = useRef();
  const bowLeftRef = useRef();
  const bowRightRef = useRef();

  // Géométries du noeud, construites une seule fois
  const bowLeftGeo = useMemo(() => makeBowLoopGeometry(-1), []);
  const bowRightGeo = useMemo(() => makeBowLoopGeometry(1), []);
  const tailLeftGeo = useMemo(() => makeTailGeometry(-1), []);
  const tailRightGeo = useMemo(() => makeTailGeometry(1), []);

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
      // les boucles s'écartent et se soulèvent légèrement à l'ouverture
      bowLeftRef.current.rotation.y = openProgress * 0.5;
      bowRightRef.current.rotation.y = openProgress * -0.5;
      bowLeftRef.current.rotation.z = openProgress * 0.35;
      bowRightRef.current.rotation.z = openProgress * -0.35;
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

        {/* noeud en vraies boucles de ruban, s'écarte quand la boîte s'ouvre */}
        <group position={[0, 0.32, 0]}>
          <mesh ref={bowLeftRef} material={ribbonMaterial} geometry={bowLeftGeo} />
          <mesh ref={bowRightRef} material={ribbonMaterial} geometry={bowRightGeo} />
          {/* pans qui retombent */}
          <mesh material={ribbonMaterial} geometry={tailLeftGeo} position={[0, -0.02, 0.02]} />
          <mesh material={ribbonMaterial} geometry={tailRightGeo} position={[0, -0.02, 0.02]} />
          {/* coeur du noeud */}
          <mesh material={ribbonMaterial}>
            <sphereGeometry args={[0.09, 16, 16]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
