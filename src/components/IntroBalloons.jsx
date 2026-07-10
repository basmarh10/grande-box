import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "./IntroBalloons.css";

/*
 * Écran d'intro : le titre du site apparaît au milieu d'un NUAGE de ballons
 * colorés qui montent et remplissent l'écran (esprit effet iMessage
 * « Ballons »), puis fondu de transition vers la home. GSAP uniquement.
 *
 * - Une seule fois par navigateur (`localStorage`). Le flag n'est posé
 *   qu'à la FIN de l'animation : si un premier chargement est interrompu
 *   (onglet fermé, erreur), l'intro rejouera à la visite suivante.
 * - QA : `?intro=1` dans l'URL force l'intro sans toucher au localStorage.
 * - Clic/tap : accélère jusqu'à la fin (jamais de coupure brute).
 * - `prefers-reduced-motion` : fondu court sans ballons.
 */

const STORAGE_KEY = "grandebox_intro_seen";

// Assombrit un hex (%) — remplace color-mix() pour compatibilité maximale.
function shade(hex, pct) {
  const n = parseInt(hex.slice(1), 16);
  const f = 1 - pct;
  const r = Math.round(((n >> 16) & 255) * f);
  const g = Math.round(((n >> 8) & 255) * f);
  const b = Math.round((n & 255) * f);
  return `rgb(${r},${g},${b})`;
}

const PALETTE = ["#F0483D", "#2EC4B6", "#FFC93C", "#8E5FD1", "#FF6FA0", "#E8B84B", "#4A1942", "#FFFDF8"];

// Nuage dense : 28 ballons répartis sur toute la largeur, 3 vagues
// entrelacées, tailles et rythmes variés (composition fixe, pas d'aléatoire).
const BALLOONS = Array.from({ length: 28 }, (_, i) => {
  const wave = i % 3;
  return {
    color: PALETTE[i % PALETTE.length],
    left: `${(i * 3.6 + (wave === 1 ? 1.8 : 0)) % 96}%`,
    size: 100 + ((i * 37) % 130),
    delay: wave * 0.35 + ((i * 13) % 10) * 0.06,
    drift: ((i % 2 === 0 ? 1 : -1) * (20 + ((i * 17) % 35))),
    dur: 2.6 + ((i * 23) % 12) * 0.09,
  };
});

function shouldShowIntro() {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  if (params.get("intro") === "1") return true; // mode QA
  return !window.localStorage.getItem(STORAGE_KEY);
}

export default function IntroBalloons() {
  const [visible, setVisible] = useState(shouldShowIntro);
  const rootRef = useRef(null);
  const tlRef = useRef(null);

  useEffect(() => {
    if (!visible || !rootRef.current) return;

    document.body.style.overflow = "hidden";
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = rootRef.current;
    const balloons = root.querySelectorAll(".ib-balloon");
    const title = root.querySelector(".ib-title");

    const finish = () => {
      // flag posé seulement quand l'intro s'est jouée jusqu'au bout
      window.localStorage.setItem(STORAGE_KEY, "1");
      document.body.style.overflow = "";
      setVisible(false);
    };

    const tl = gsap.timeline({ onComplete: finish });
    tlRef.current = tl;

    if (reduceMotion) {
      tl.fromTo(title, { opacity: 0 }, { opacity: 1, duration: 0.3 })
        .to(root, { opacity: 0, duration: 0.5 }, "+=0.8");
      return () => { tl.kill(); document.body.style.overflow = ""; };
    }

    tl.fromTo(
      title,
      { opacity: 0, scale: 0.92 },
      { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" },
      0.15
    );
    balloons.forEach((el, i) => {
      const b = BALLOONS[i];
      tl.fromTo(
        el,
        { y: "112vh", x: 0, rotation: b.drift > 0 ? -6 : 6 },
        {
          y: "-135vh",
          x: b.drift,
          rotation: b.drift > 0 ? 5 : -5,
          duration: b.dur,
          ease: "power1.inOut",
        },
        b.delay
      );
    });
    // transition de sortie : le titre s'élève, l'overlay fond vers la home
    tl.to(title, { opacity: 0, y: -28, duration: 0.55, ease: "power2.in" }, 3.0)
      .to(root, { opacity: 0, duration: 0.75, ease: "power2.inOut" }, 3.3);

    return () => { tl.kill(); document.body.style.overflow = ""; };
  }, [visible]);

  if (!visible) return null;

  // Clic/tap : on accélère la timeline (fin naturelle, transition conservée)
  const skip = () => { tlRef.current?.timeScale(3.5); };

  return (
    <div
      ref={rootRef}
      onClick={skip}
      className="ib-root"
      role="dialog"
      aria-label="Animation d'introduction Grande Box — cliquez pour passer"
    >
      <p className="ib-title">
        <span className="ib-title-main">Grande Box</span>
        <span className="ib-title-sub">La surprise commence…</span>
      </p>
      {BALLOONS.map((b, i) => (
        <div
          key={i}
          className="ib-balloon"
          style={{
            left: b.left,
            width: b.size,
            height: b.size * 1.18,
            "--ib-color": b.color,
            "--ib-dark": shade(b.color, 0.28),
            "--ib-knot": shade(b.color, 0.2),
          }}
        >
          <span className="ib-knot" />
          <span className="ib-string" />
        </div>
      ))}
      <p className="ib-skip">Cliquez pour passer</p>
    </div>
  );
}
