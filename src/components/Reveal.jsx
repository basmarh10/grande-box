import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Fait apparaître son contenu (fondu + léger décalage) quand il entre dans le
// viewport en scrollant. `y` et `delay` permettent de décaler plusieurs
// éléments d'une même section pour un effet en cascade.
export default function Reveal({ children, className = "", y = 32, delay = 0, once = true }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: once ? "play none none none" : "play none none reverse",
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [y, delay, once]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
