import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Balloon3D from "./Balloon3D";

/*
 * Ballon éclatable au clic : POP -> éclat de particules de la même couleur,
 * puis le ballon regonfle en douceur au même endroit après ~2,5 s.
 */
const SHARD_COUNT = 12;

export default function PoppableBalloon({ color, scale = 1, onPop }) {
  const [status, setStatus] = useState("alive"); // alive | popped
  const groupRef = useRef();
  const shardsRef = useRef();
  const popTime = useRef(0);
  const respawnAt = useRef(0);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const shards = useMemo(
    () =>
      Array.from({ length: SHARD_COUNT }, (_, i) => {
        const a = (i / SHARD_COUNT) * Math.PI * 2;
        return {
          dir: new THREE.Vector3(Math.cos(a), Math.sin(a) * 0.8 + 0.3, (Math.random() - 0.5)).normalize(),
          speed: 2.4 + Math.random() * 1.6,
        };
      }),
    []
  );

  const pop = (e) => {
    e.stopPropagation();
    if (status !== "alive") return;
    setStatus("popped");
    popTime.current = 0;
    respawnAt.current = 2.5;
    document.body.style.cursor = "auto";
    onPop?.();
  };

  useFrame((state, delta) => {
    if (status === "popped") {
      popTime.current += delta;
      // éclats qui fusent puis s'éteignent (0,45 s)
      if (shardsRef.current) {
        const t = Math.min(popTime.current / 0.45, 1);
        shards.forEach((s, i) => {
          dummy.position.copy(s.dir).multiplyScalar(s.speed * t * 0.6);
          dummy.scale.setScalar(Math.max(0.0001, (1 - t) * 0.09 * scale * 3));
          dummy.updateMatrix();
          shardsRef.current.setMatrixAt(i, dummy.matrix);
        });
        shardsRef.current.instanceMatrix.needsUpdate = true;
        shardsRef.current.visible = t < 1;
      }
      if (popTime.current >= respawnAt.current) setStatus("alive");
    } else if (groupRef.current) {
      // regonflage élastique après respawn
      const s = groupRef.current.scale.x;
      const target = 1;
      const next = THREE.MathUtils.damp(s, target, 6, delta);
      groupRef.current.scale.setScalar(next);
    }
  });

  return (
    <group>
      {status === "alive" && (
        <group
          ref={groupRef}
          scale={0.01}
          onPointerDown={pop}
          onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = "pointer"; }}
          onPointerOut={() => { document.body.style.cursor = "auto"; }}
        >
          <Balloon3D color={color} scale={scale} />
        </group>
      )}
      {status === "popped" && (
        <instancedMesh ref={shardsRef} args={[null, null, SHARD_COUNT]} frustumCulled={false}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </instancedMesh>
      )}
    </group>
  );
}
