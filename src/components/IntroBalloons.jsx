import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "./IntroBalloons.css";

/*
 * Écran d'intro « grands ballons » — esprit effet iMessage « Ballons » :
 * au tout premier chargement, de gros ballons colorés montent et remplissent
 * l'écran, puis l'overlay se fond vers la home. GSAP uniquement (pas de
 * Framer Motion).
 *
 * - Une seule fois par navigateur : flag `localStorage` (survit à la
 *   fermeture de l'onglet, contrairement à sessionStorage).
 * - QA : `?intro=1` dans l'URL force l'intro sans vider le localStorage.
 * - Passable au clic/tap à tout moment (accéléré, jamais coupé net).
 * - `prefers-reduced-motion` : simple fondu court, sans ballons.
 */

const STORAGE_KEY = "grandebox_intro_seen";

// Composition fixe (pas d'aléatoire) : deux vagues croisées qui couvrent
// toute la largeur, tailles variées, palette v3.
const BALLOONS = [
  { color: "#F0483D", left: "6%",  size: 190, delay: 0.0,  drift: 40,  dur: 3.1 },
  { color: "#2EC4B6", left: "16%", size: 150, delay: 0.25, drift: -30, dur: 2.8 },
  { color: "#FFC93C", left: "26%", size: 220, delay: 0.1,  drift: 25,  dur: 3.3 },
  { color: "#8E5FD1", left: "36%", size: 160, delay: 0.35, drift: -45, dur: 2.9 },
  { color: "#FF6FA0", left: "46%", size: 200, delay: 0.05, drift: 35,  dur: 3.2 },
  { color: "#E8B84B", left: "56%", size: 145, delay: 0.3,  drift: -25, dur: 2.7 },
  { color: "#4A1942", left: "66%", size: 210, delay: 0.15, drift: 30,  dur: 3.4 },
  { color: "#F0483D", left: "76%", size: 155, delay: 0.4,  drift: -35, dur: 2.8 },
  { color: "#2EC4B6", left: "86%", size: 185, delay: 0.2,  drift: 45,  dur: 3.1 },
  { color: "#FF6FA0", left: "11%", size: 120, delay: 0.55, drift: -20, dur: 2.6 },
  { color: "#FFC93C", left: "31%", size: 110, delay: 0.65, drift: 30,  dur: 2.5 },
  { color: "#8E5FD1", left: "51%", size: 130, delay: 0.5,  drift: -30, dur: 2.7 },
  { color: "#E8B84B", left: "71%", size: 115, delay: 0.7,  drift: 20,  dur: 2.5 },
  { color: "#FFFDF8", left: "91%", size: 125, delay: 0.6,  drift: -40, dur: 2.6 },
  { color: "#F0483D", left: "41%", size: 105, delay: 0.75, drift: 25,  dur: 2.4 },
  { color: "#2EC4B6", left: "61%", size: 100, delay: 0.8,  drift: -20, dur: 2.4 },
];

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

    window.localStorage.setItem(STORAGE_KEY, "1");
    document.body.style.overflow = "hidden";

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = rootRef.current;
    const balloons = root.querySelectorAll(".ib-balloon");
    const title = root.querySelector(".ib-title");

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        setVisible(false);
      },
    });
    tlRef.current = tl;

    if (reduceMotion) {
      // pas d'animation de ballons : titre bref, fondu doux
      tl.fromTo(title, { opacity: 0 }, { opacity: 1, duration: 0.3 })
        .to(root, { opacity: 0, duration: 0.5 }, "+=0.8");
      return () => { tl.kill(); document.body.style.overflow = ""; };
    }

    tl.fromTo(
      title,
      { opacity: 0, scale: 0.92 },
      { opacity: 1, scale: 1, duration: 0.7, ease: "power2.out" },
      0
    );
    balloons.forEach((el, i) => {
      const b = BALLOONS[i];
      tl.fromTo(
        el,
        { y: "110vh", x: 0, rotation: b.drift > 0 ? -6 : 6 },
        {
          y: "-130vh",
          x: b.drift,
          rotation: b.drift > 0 ? 5 : -5,
          duration: b.dur,
          ease: "power1.inOut",
        },
        b.delay
      );
    });
    // fondu de sortie pendant que les derniers ballons finissent de monter
    tl.to(title, { opacity: 0, y: -24, duration: 0.5, ease: "power2.in" }, 2.6)
      .to(root, { opacity: 0, duration: 0.7, ease: "power2.inOut" }, 2.9);

    return () => { tl.kill(); document.body.style.overflow = ""; };
  }, [visible]);

  if (!visible) return null;

  // Clic/tap : on accélère la timeline (fin naturelle, jamais de coupure brute)
  const skip = () => { tlRef.current?.timeScale(3.2); };

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
