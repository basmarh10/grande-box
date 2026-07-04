import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Objet mutable lu à chaque frame par la scène 3D (via useFrame), pour éviter
// de faire re-render tout React à chaque pixel de scroll.
export const scrollState = { progress: 0 };

// À appeler une fois (dans Home) : relie le scroll de la page entière (Lenis)
// à `scrollState.progress`, de 0 (haut de page) à 1 (bas de page).
export function initScrollProgress(triggerEl) {
  const trigger = ScrollTrigger.create({
    trigger: triggerEl,
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate: (self) => {
      scrollState.progress = self.progress;
    },
  });
  return () => trigger.kill();
}
