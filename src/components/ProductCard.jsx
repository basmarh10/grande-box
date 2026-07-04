import { Link } from "react-router-dom";
import GiftBox from "./GiftBox";

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/nos-box/${product.id}`}
      className="group block bg-white rounded-xl2 p-6 shadow-sm hover:shadow-lg transition-shadow"
    >
      <div className="aspect-square rounded-xl bg-cream-soft flex items-center justify-center mb-6 overflow-hidden">
        <GiftBox
          tone={product.color}
          className="w-2/3 h-2/3 transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <span className="inline-block text-xs font-semibold tracking-wide uppercase text-coral mb-2">
        Taille {product.size}
      </span>
      <h3 className="font-display text-xl text-forest mb-1">{product.name}</h3>
      <p className="text-sm text-ink/60 mb-4">{product.tagline}</p>

      <div className="flex items-center justify-between">
        <span className="font-display text-lg text-forest">{product.price} €</span>
        <span className="text-sm font-medium text-forest group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
          Découvrir →
        </span>
      </div>
    </Link>
  );
}
