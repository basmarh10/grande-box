/*
 * Point d'entrée de l'outil de rendu des visuels catalogue (box-render.html).
 * Rend la GiftBox3D fermée, en vue 3/4, sur fond transparent — même modèle,
 * mêmes matériaux et même éclairage que les scènes du site : les visuels
 * détourés du catalogue sont donc parfaitement raccord avec la 3D live.
 */
import { createRoot } from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import GiftBox3D from "./three/GiftBox3D";

const params = new URLSearchParams(window.location.search);
const boxColor = "#" + (params.get("box") || "F0483D");
const ribbonColor = "#" + (params.get("ribbon") || "E8B84B");

function markReady() {
  window.__RENDER_READY = true;
}

createRoot(document.getElementById("root")).render(
  <Canvas
    shadows
    camera={{ position: [2.3, 1.55, 3.1], fov: 34 }}
    dpr={2}
    gl={{ alpha: true, preserveDrawingBuffer: true, antialias: true }}
    style={{ background: "transparent" }}
    onCreated={({ gl }) => {
      gl.setClearColor(0x000000, 0);
      setTimeout(markReady, 1200);
    }}
  >
    <ambientLight intensity={0.55} />
    <hemisphereLight args={["#fff8ec", "#e8d9bd", 1.1]} />
    <directionalLight position={[3, 5, 2]} intensity={1.6} castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0004} shadow-normalBias={0.06} />
    <pointLight position={[-4, 2.5, 3]} intensity={14} color="#FFF3E0" />
    <pointLight position={[0, 3, -4]} intensity={10} color="#FFE8EC" />
    <spotLight position={[0, 1.6, 5.5]} angle={0.7} penumbra={1} intensity={22} />
    <GiftBox3D boxColor={boxColor} ribbonColor={ribbonColor} position={[0, -0.25, 0]} />
  </Canvas>
);
