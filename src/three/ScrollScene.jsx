import { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import GiftBox3D from "./GiftBox3D";
import PoppableBalloon from "./PoppableBalloon";
import Confetti from "./Confetti";
import BoxContents from "./BoxContents";
import { scrollState } from "../lib/scrollProgress";

/*
 * Scène 3D de la page d'accueil.
 * - La boîte (laquée, arêtes arrondies) s'ouvre au scroll ; confettis au passage.
 * - Les ballons sont petits, flottent en continu (portance + balancement)
 *   et ÉCLATENT au clic (voir PoppableBalloon), puis regonflent.
 * - Éclairage 100 % local (pas de HDRI réseau) : rendu stable et rapide.
 */
/*
 * Composition en ARC autour de la boîte (coordonnées relatives au groupe,
 * lui-même décalé à x=1.8 monde — la boîte est à droite du titre).
 * Zone d'exclusion vérifiée sur TOUT le cycle (flottement ±0.16, montée
 * d'ouverture +0.5 max, trajectoire du couvercle vers le haut-droite) :
 * aucun ballon ne touche jamais la boîte ni le couvercle, aucun ne passe
 * sur le titre ou les CTA.
 */
const BALLOONS = [
  // arc au-dessus du titre, du coin gauche vers la boîte
  { color: "#FF6FA0", baseX: -4.4, baseY: 2.5, baseZ: -2.0, speed: 1.15, offset: 7.0, scale: 0.2 },
  { color: "#8E5FD1", baseX: -3.4, baseY: 1.95, baseZ: -1.6, speed: 1.1, offset: 2.1, scale: 0.24 },
  { color: "#FFC93C", baseX: -2.4, baseY: 2.45, baseZ: -1.3, speed: 1.0, offset: 4.5, scale: 0.28 },
  { color: "#2EC4B6", baseX: -1.5, baseY: 2.0, baseZ: -0.6, speed: 0.95, offset: 1.3, scale: 0.4 },
  { color: "#F0483D", baseX: -0.65, baseY: 2.4, baseZ: -0.9, speed: 1.2, offset: 0.0, scale: 0.34 },
  { color: "#FFFDF8", baseX: 0.15, baseY: 2.85, baseZ: -1.6, speed: 1.05, offset: 3.9, scale: 0.22 },
  // marge gauche de l'écran (avant le début du texte)
  { color: "#FFFDF8", baseX: -5.0, baseY: 1.2, baseZ: -1.2, speed: 1.0, offset: 6.1, scale: 0.26 },
  { color: "#4A1942", baseX: -5.2, baseY: 0.1, baseZ: -0.6, speed: 0.85, offset: 7.8, scale: 0.3 },
  // bord droit de l'écran, sous la trajectoire du couvercle
  { color: "#E8B84B", baseX: 1.45, baseY: 0.25, baseZ: 0.6, speed: 1.15, offset: 4.6, scale: 0.36 },
  { color: "#FF6FA0", baseX: 1.6, baseY: 1.15, baseZ: -0.5, speed: 0.9, offset: 5.4, scale: 0.28 },
  // premier plan, posés devant la boîte (profondeur)
  { color: "#2EC4B6", baseX: -1.35, baseY: -0.15, baseZ: 1.3, speed: 1.25, offset: 6.2, scale: 0.3 },
  { color: "#FFC93C", baseX: -1.6, baseY: -0.35, baseZ: 1.6, speed: 0.9, offset: 8.2, scale: 0.26 },
];

function clamp01(v) { return Math.min(1, Math.max(0, v)); }
function remap(v, a, b) { return clamp01((v - a) / (b - a)); }

function SceneContent() {
  const openRef = useRef(0);
  const balloonRefs = useRef([]);
  const groupRef = useRef();
  const confettiFire = useRef(null);
  const confettiDone = useRef(false);
  const { camera } = useThree();

  useFrame((state) => {
    const p = scrollState.progress; // 0 -> 1 sur toute la page
    const t = state.clock.elapsedTime;

    // Phase 1 (0.02 -> 0.16) : la boîte s'ouvre
    const openProgress = remap(p, 0.02, 0.16);
    openRef.current = openProgress;

    // Confettis : un seul burst, au moment où le couvercle se soulève
    if (openProgress > 0.45 && !confettiDone.current) {
      confettiDone.current = true;
      confettiFire.current?.();
    }
    if (openProgress < 0.05) confettiDone.current = false;

    // Phase 2 (0.1 -> 0.4) : la scène glisse à gauche, la caméra recule.
    // Au repos la boîte est à droite du titre (x=1.55), jamais dessus.
    const shift = remap(p, 0.1, 0.4);
    if (groupRef.current) {
      groupRef.current.position.x = THREE.MathUtils.lerp(1.8, -1.6, shift);
    }
    camera.position.z = THREE.MathUtils.lerp(5.5, 7.2, shift);
    camera.position.y = THREE.MathUtils.lerp(0.5, 1.1, shift);
    camera.lookAt(0, 0, 0);

    // Phase 3 (0.55 -> 0.82) : tout s'estompe avant catalogue/CTA
    const fade = 1 - remap(p, 0.55, 0.82);
    if (groupRef.current) {
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(0.7, 1, fade));
      groupRef.current.visible = fade > 0.01;
    }

    // Ballons : flottement PERMANENT (portance + houle + balancement),
    // amplifié quand la boîte s'ouvre, envol en phase 2.
    const flyAway = remap(p, 0.16, 0.4);
    balloonRefs.current.forEach((ref, i) => {
      if (!ref) return;
      const b = BALLOONS[i];
      const rise = openProgress * 0.5 + flyAway * (2.2 + i * 0.25);
      const bob = Math.sin(t * b.speed + b.offset) * 0.16
                + Math.sin(t * b.speed * 0.37 + b.offset * 2.1) * 0.07;
      const sway = Math.cos(t * b.speed * 0.55 + b.offset) * 0.12;
      ref.position.y = b.baseY + rise + bob;
      ref.position.x = b.baseX * (1 + flyAway * 0.6) + sway;
      ref.position.z = b.baseZ;
      ref.rotation.z = Math.sin(t * 0.7 + b.offset) * 0.1;
    });
  });

  return (
    <group ref={groupRef}>
      <GiftBox3D openRef={openRef} boxColor="#F0483D" ribbonColor="#E8B84B" position={[0, -0.2, 0]} />
      {/* contenu intérieur (mini-cadeaux, rubans, sparkles) — composant
          partagé avec la fiche produit, révélé à l'ouverture */}
      <BoxContents openRef={openRef} position={[0, 0.3, 0]} />
      <Confetti fireRef={confettiFire} origin={[0, 0.55, 0]} />
      {BALLOONS.map((b, i) => (
        <group key={i} ref={(el) => (balloonRefs.current[i] = el)} position={[b.baseX, b.baseY, b.baseZ]}>
          <PoppableBalloon color={b.color} scale={b.scale} />
        </group>
      ))}
      <ContactShadows position={[0, -0.78, 0]} opacity={0.32} scale={6} blur={2.5} far={2} />
    </group>
  );
}

export default function ScrollScene() {
  return (
    // pointer-events-auto : nécessaire pour pouvoir éclater les ballons au clic.
    // Le contenu du hero repasse en pointer-events-none avec réactivation
    // ciblée sur les liens/boutons (voir Home.jsx).
    <div className="fixed inset-0 -z-10">
      {/* eventSource=body : le canvas est derrière tout le contenu, les clics
          qui traversent la page remontent au <body> et sont raycastés dans la
          scène — c'est ce qui permet d'éclater les ballons au clic. */}
      <Canvas
        shadows
        camera={{ position: [0, 0.5, 5.5], fov: 42 }}
        dpr={[1, 1.8]}
        eventSource={document.body}
        eventPrefix="client"
      >
        <color attach="background" args={["#F8F3E9"]} />
        {/* rig d'éclairage local : clé + contre + douche avant pour le glossy */}
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
        <spotLight position={[0, 1.4, 5.5]} angle={0.7} penumbra={1} intensity={20} />
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
