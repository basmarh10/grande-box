import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GiftBox from "./GiftBox";
import Balloon from "./Balloon";

// La fonctionnalité signature du projet : un portail d'entrée où l'on clique sur une
// boîte, des ballons en sortent, puis on accède au site. Voir l'étape 4 du guide.

const BALLOON_CONFIGS = [
  { color: "#E8583F", x: -120, y: -220, rotate: -15, delay: 0 },
  { color: "#D9A441", x: -40, y: -260, rotate: 8, delay: 0.05 },
  { color: "#163828", x: 50, y: -250, rotate: -6, delay: 0.1 },
  { color: "#E8583F", x: 130, y: -210, rotate: 14, delay: 0.15 },
  { color: "#D9A441", x: -180, y: -130, rotate: -20, delay: 0.08 },
  { color: "#163828", x: 190, y: -120, rotate: 18, delay: 0.18 },
];

const SESSION_KEY = "grandebox_has_entered";

export default function BoxIntro({ onEnter }) {
  const [status, setStatus] = useState("idle"); // idle | opening
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const handleOpen = () => {
    if (status !== "idle") return;
    setStatus("opening");
    sessionStorage.setItem(SESSION_KEY, "1");
    window.setTimeout(onEnter, reducedMotion ? 150 : 1500);
  };

  return (
    <div className="fixed inset-0 bg-cream flex flex-col items-center justify-center overflow-hidden">
      <button
        onClick={handleOpen}
        className="absolute top-6 right-6 text-sm text-ink/50 hover:text-ink underline underline-offset-4"
      >
        Passer l'intro →
      </button>

      <div className="relative flex flex-col items-center px-6 text-center">
        <p className="font-body text-sm uppercase tracking-[0.2em] text-coral mb-6">
          Ce n'est pas juste une boîte
        </p>

        <motion.button
          onClick={handleOpen}
          className="relative w-48 h-44 md:w-64 md:h-56"
          animate={status === "idle" ? { y: [0, -10, 0] } : { scale: 0, opacity: 0 }}
          transition={
            status === "idle"
              ? { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.4, delay: 0.15 }
          }
          aria-label="Ouvrir la boîte pour entrer sur le site"
        >
          <GiftBox tone="forest" className="w-full h-full drop-shadow-xl" />
        </motion.button>

        {status === "idle" && (
          <p className="mt-6 font-display text-2xl md:text-3xl text-forest">
            Cliquez sur la boîte
          </p>
        )}

        <AnimatePresence>
          {status === "opening" && !reducedMotion &&
            BALLOON_CONFIGS.map((b, i) => (
              <motion.div
                key={i}
                className="absolute left-1/2 top-1/2 w-10 md:w-14 -ml-5 -mt-5"
                initial={{ x: -10, y: -10, opacity: 0, scale: 0.4 }}
                animate={{ x: b.x, y: b.y, opacity: 1, scale: 1, rotate: b.rotate }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.1, delay: b.delay, ease: "easeOut" }}
              >
                <Balloon color={b.color} />
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
