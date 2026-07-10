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
/*
 * 15 ballons — toutes les zones de la section sont habitées :
 * arc au-dessus du titre, coin haut-droit (près du Panier), toute la
 * marge gauche (4 hauteurs), bande basse sous les boutons et sous la
 * boîte. Coordonnées relatives au groupe (x=2.55 monde).
 * Exclusion vérifiée sur tout le cycle : flottement ±0.16, montée +0.5,
 * couvercle (dérive 0.6 → pointes à ~1.0 rel / y 2.4-3.2) — aucun contact.
 */
const BALLOONS = [
  // arc au-dessus du titre, de gauche à droite
  { color: "#FF6FA0", baseX: -5.15, baseY: 2.5, baseZ: -2.0, speed: 1.15, offset: 7.0, scale: 0.2 },
  { color: "#8E5FD1", baseX: -4.15, baseY: 1.95, baseZ: -1.6, speed: 1.1, offset: 2.1, scale: 0.24 },
  { color: "#FFC93C", baseX: -3.15, baseY: 2.45, baseZ: -1.3, speed: 1.0, offset: 4.5, scale: 0.28 },
  { color: "#2EC4B6", baseX: -2.25, baseY: 2.0, baseZ: -0.6, speed: 0.95, offset: 1.3, scale: 0.4 },
  { color: "#F0483D", baseX: -1.4, baseY: 2.4, baseZ: -0.9, speed: 1.2, offset: 0.0, scale: 0.34 },
  { color: "#FFFDF8", baseX: -0.6, baseY: 2.85, baseZ: -1.6, speed: 1.05, offset: 3.9, scale: 0.22 },
  // coin haut-droit, près du bouton Panier
  { color: "#E8B84B", baseX: 1.15, baseY: 2.85, baseZ: -1.2, speed: 0.9, offset: 5.4, scale: 0.24 },
  // toute la marge gauche (4 hauteurs)
  { color: "#F0483D", baseX: -5.7, baseY: 2.3, baseZ: -1.5, speed: 1.05, offset: 9.3, scale: 0.22 },
  { color: "#FFFDF8", baseX: -5.75, baseY: 1.2, baseZ: -1.2, speed: 1.0, offset: 6.1, scale: 0.26 },
  { color: "#4A1942", baseX: -5.95, baseY: 0.1, baseZ: -0.6, speed: 0.85, offset: 7.8, scale: 0.3 },
  { color: "#2EC4B6", baseX: -5.9, baseY: -0.9, baseZ: 0.3, speed: 1.1, offset: 10.2, scale: 0.28 },
  // bande basse : sous les boutons et sous la boîte (premier plan)
  { color: "#FFC93C", baseX: -1.05, baseY: -1.15, baseZ: 1.2, speed: 0.9, offset: 8.2, scale: 0.26 },
  { color: "#8E5FD1", baseX: -0.05, baseY: -1.3, baseZ: 1.4, speed: 1.25, offset: 6.2, scale: 0.24 },
  { color: "#FF6FA0", baseX: 0.45, baseY: -1.35, baseZ: 1.5, speed: 1.0, offset: 11.1, scale: 0.26 },
  { color: "#2EC4B6", baseX: -1.85, baseY: -1.2, baseZ: 1.3, speed: 1.2, offset: 12.0, scale: 0.3 },
  // couche lointaine « nuage » : petits ballons en altitude sur toute la
  // largeur (z très en retrait — ils passent au-dessus du texte sans gêner)
  { color: "#FFC93C", baseX: -5.9, baseY: 2.6, baseZ: -3.5, speed: 0.8, offset: 13.1, scale: 0.18 },
  { color: "#F0483D", baseX: -4.2, baseY: 3.0, baseZ: -4.0, speed: 0.95, offset: 14.0, scale: 0.18 },
  { color: "#8E5FD1", baseX: -2.4, baseY: 2.9, baseZ: -3.8, speed: 0.85, offset: 15.2, scale: 0.16 },
  { color: "#FF6FA0", baseX: -0.9, baseY: 3.2, baseZ: -4.4, speed: 1.0, offset: 16.1, scale: 0.18 },
  { color: "#2EC4B6", baseX: 0.8, baseY: 3.0, baseZ: -4.0, speed: 0.9, offset: 17.3, scale: 0.16 },
  // combleurs de vides (mi-hauteurs et air à droite, loin derrière la boîte)
  { color: "#E8B84B", baseX: -3.3, baseY: 1.35, baseZ: -2.4, speed: 1.05, offset: 18.2, scale: 0.2 },
  { color: "#FFFDF8", baseX: -1.5, baseY: 1.35, baseZ: -2.6, speed: 1.15, offset: 19.0, scale: 0.2 },
  { color: "#8E5FD1", baseX: 1.9, baseY: 1.8, baseZ: -3.2, speed: 0.9, offset: 20.4, scale: 0.18 },
  { color: "#F0483D", baseX: 2.2, baseY: 0.6, baseZ: -2.8, speed: 1.1, offset: 21.3, scale: 0.2 },
  { color: "#FFC93C", baseX: -0.38, baseY: -1.05, baseZ: 1.6, speed: 1.0, offset: 22.2, scale: 0.22 },
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

    // Phase 1 (0.03 -> 0.34) : la boîte s'ouvre — plage volontairement
    // LONGUE pour que la révélation (confettis, mini-cadeaux) soit posée
    // et qu'on ait le temps d'en profiter.
    const openProgress = remap(p, 0.03, 0.34);
    openRef.current = openProgress;

    // Confettis : un seul burst, au moment où le couvercle se soulève
    if (openProgress > 0.45 && !confettiDone.current) {
      confettiDone.current = true;
      confettiFire.current?.();
    }
    if (openProgress < 0.05) confettiDone.current = false;

    // Phase 2 (0.30 -> 0.55) : la scène glisse à gauche, la caméra recule
    // — ne démarre qu'une fois la révélation presque terminée.
    const shift = remap(p, 0.30, 0.55);
    if (groupRef.current) {
      groupRef.current.position.x = THREE.MathUtils.lerp(2.38, -1.6, shift);
    }
    camera.position.z = THREE.MathUtils.lerp(6.2, 7.5, shift);
    camera.position.y = THREE.MathUtils.lerp(0.5, 1.1, shift);
    camera.lookAt(0, 0, 0);

    // Phase 3 (0.55 -> 0.82) : tout s'estompe avant catalogue/CTA
    const fade = 1 - remap(p, 0.62, 0.85);
    if (groupRef.current) {
      groupRef.current.scale.setScalar(0.9 * THREE.MathUtils.lerp(0.7, 1, fade));
      groupRef.current.visible = fade > 0.01;
    }

    // Ballons : flottement PERMANENT (portance + houle + balancement),
    // amplifié quand la boîte s'ouvre, envol en phase 2.
    const flyAway = remap(p, 0.32, 0.55);
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
      <GiftBox3D openRef={openRef} boxColor="#F0483D" ribbonColor="#E8B84B" lidDrift={0.6} position={[0, -0.2, 0]} />
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
        camera={{ position: [0, 0.5, 6.2], fov: 42 }}
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
