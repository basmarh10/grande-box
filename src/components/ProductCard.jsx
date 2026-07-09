import { useRef } from "react";
import { Link } from "react-router-dom";
import "./ProductCard.css";

// Cadres colorés par box : chaque taille a sa teinte (palette du site),
// ce qui rend le catalogue coloré tout en restant cohérent.
const FRAME_TINTS = {
  "box-m": "from-coral/15 via-cream-soft to-cream-soft",
  "box-l": "from-turquoise/20 via-cream-soft to-cream-soft",
  "box-xl": "from-violet/20 via-cream-soft to-cream-soft",
  "box-xxl": "from-forest/15 via-cream-soft to-cream-soft",
};

// Carte produit : rendu 3D détouré de la box, taille du visuel PROPORTIONNELLE
// aux dimensions réelles (50/70/100/130 cm), toutes les box posées sur la même
// ligne de sol. Tilt réactif au survol + flottement doux.
export default function ProductCard({ product, floatDelay = 0 }) {
  const cardRef = useRef(null);
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const handleMove = (e) => {
    if (reduceMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    cardRef.current.style.setProperty("--tilt-x", `${(-py * 7).toFixed(2)}deg`);
    cardRef.current.style.setProperty("--tilt-y", `${(px * 9).toFixed(2)}deg`);
  };

  const handleLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty("--tilt-x", "0deg");
    cardRef.current.style.setProperty("--tilt-y", "0deg");
  };

  // 92 % de la largeur du cadre pour le XXL, puis proportionnel en dessous.
  const visualWidth = `${Math.round(product.sizeRatio * 92)}%`;

  return (
    <Link
      ref={cardRef}
      to={`/nos-box/${product.id}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="product-card group flex h-full flex-col bg-white rounded-xl2 p-6 shadow-sm"
      style={{ "--float-delay": `${floatDelay}s` }}
    >
      <div
        className={`aspect-square rounded-xl bg-gradient-to-br ${FRAME_TINTS[product.id] ?? "from-cream-soft to-cream-soft"} flex items-end justify-center mb-6 overflow-hidden px-4 pb-5`}
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          style={{ width: visualWidth }}
          className="product-card__img object-contain"
        />
      </div>

      <span className="inline-block text-xs font-semibold tracking-wide uppercase text-coral mb-2">
        Taille {product.size} · {product.sizeCm} cm
      </span>
      <h3 className="font-display text-xl text-forest mb-1">{product.name}</h3>
      <p className="text-sm text-ink/60 mb-4">{product.tagline}</p>

      {/* mt-auto : cette ligne reste collée en bas, cartes toujours alignées */}
      <div className="mt-auto flex items-center justify-between pt-2">
        <span className="font-display text-lg text-forest">{product.price} €</span>
        <span className="text-sm font-medium text-coral group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
          Découvrir →
        </span>
      </div>
    </Link>
  );
}
