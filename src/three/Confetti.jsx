import { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/*
 * Burst de confettis (InstancedMesh, ~90 petits rectangles).
 * Usage : passer une ref `fireRef` ; le parent déclenche avec
 * fireRef.current?.() — les confettis jaillissent puis retombent en
 * tournoyant et disparaissent. Palette du site uniquement.
 */
const COLORS = ["#D6252E", "#D9A441", "#F2A9B4", "#FFFDF8", "#111111"];
const COUNT = 90;
const GRAVITY = -3.2;
const LIFE = 2.6;

export default function Confetti({ fireRef, origin = [0, 0.4, 0] }) {
  const meshRef = useRef();
  const particles = useMemo(
    () =>
      Array.from({ length: COUNT }, () => ({
        pos: new THREE.Vector3(),
        vel: new THREE.Vector3(),
        rotAxis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize(),
        rotSpeed: 6 + Math.random() * 10,
        age: Infinity, // Infinity = inactif
      })),
    []
  );
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Couleurs par instance, fixées une fois.
  useEffect(() => {
    if (!meshRef.current) return;
    const c = new THREE.Color();
    for (let i = 0; i < COUNT; i++) {
      c.set(COLORS[i % COLORS.length]);
      meshRef.current.setColorAt(i, c);
    }
    meshRef.current.instanceColor.needsUpdate = true;
  }, []);

  useEffect(() => {
    if (!fireRef) return;
    fireRef.current = () => {
      particles.forEach((p) => {
        p.pos.set(origin[0], origin[1], origin[2]);
        const angle = Math.random() * Math.PI * 2;
        const spread = 0.6 + Math.random() * 1.4;
        p.vel.set(
          Math.cos(angle) * spread,
          2.2 + Math.random() * 2.4,
          Math.sin(angle) * spread
        );
        p.age = 0;
      });
    };
    return () => { fireRef.current = null; };
  }, [fireRef, origin, particles]);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    let anyAlive = false;
    particles.forEach((p, i) => {
      if (p.age < LIFE) {
        anyAlive = true;
        p.age += delta;
        p.vel.y += GRAVITY * delta;
        // traînée d'air : les confettis ralentissent et papillonnent
        p.vel.multiplyScalar(1 - 0.9 * delta);
        p.pos.addScaledVector(p.vel, delta);
        const fade = 1 - Math.max(0, (p.age - LIFE * 0.6) / (LIFE * 0.4));
        dummy.position.copy(p.pos);
        dummy.rotation.set(0, 0, 0);
        dummy.rotateOnAxis(p.rotAxis, p.age * p.rotSpeed);
        dummy.scale.setScalar(Math.max(0.0001, fade));
      } else {
        dummy.position.set(0, -999, 0);
        dummy.scale.setScalar(0.0001);
      }
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.visible = anyAlive;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, COUNT]} frustumCulled={false}>
      <planeGeometry args={[0.09, 0.13]} />
      <meshBasicMaterial side={THREE.DoubleSide} toneMapped={false} />
    </instancedMesh>
  );
}
