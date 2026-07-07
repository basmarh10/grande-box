import { useRef } from "react";
import { Link } from "react-router-dom";
import "./ProductCard.css";

// Carte produit : photo réelle détourée, tilt 3D qui suit la souris,
// flottement doux de la photo, prix et CTA toujours calés en bas
// (hauteurs égales entre cartes quel que soit la longueur des textes).
export default function ProductCard({ product, floatDelay = 0 }) {
  const cardRef = useRef(null);
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const handleMove = (e) => {
    if (reduceMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;  // -0.5 -> 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    cardRef.current.style.setProperty("--tilt-x", `${(-py * 7).toFixed(2)}deg`);
    cardRef.current.style.setProperty("--tilt-y", `${(px * 9).toFixed(2)}deg`);
  };

  const handleLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty("--tilt-x", "0deg");
    cardRef.current.style.setProperty("--tilt-y", "0deg");
  };

  return (
    <Link
      ref={cardRef}
      to={`/nos-box/${product.id}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="product-card group flex h-full flex-col bg-white rounded-xl2 p-6 shadow-sm"
      style={{ "--float-delay": `${floatDelay}s` }}
    >
      <div className="aspect-square rounded-xl bg-cream-soft flex items-center justify-center mb-6 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="product-card__img w-3/4 h-3/4 object-contain"
        />
      </div>

      <span className="inline-block text-xs font-semibold tracking-wide uppercase text-coral mb-2">
        Taille {product.size}
      </span>
      <h3 className="font-display text-xl text-forest mb-1">{product.name}</h3>
      <p className="text-sm text-ink/60 mb-4">{product.tagline}</p>

      {/* mt-auto : cette ligne reste collée en bas, cartes toujours alignées */}
      <div className="mt-auto flex items-center justify-between pt-2">
        <span className="font-display text-lg text-forest">{product.price} €</span>
        <span className="text-sm font-medium text-forest group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
          Découvrir →
        </span>
      </div>
    </Link>
  );
}
