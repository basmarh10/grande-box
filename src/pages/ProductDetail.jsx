import { useState } from "react";
import "../components/ProductCard.css";
import { useParams, Link, useNavigate } from "react-router-dom";
import BubbleText from "../components/BubbleText";
import { getProductById } from "../data/products";
import { useCart } from "../context/CartContext";

const COLOR_OPTIONS = ["Noir & or", "Doré", "Rouge", "Sur-mesure"];

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const product = getProductById(id);

  const [color, setColor] = useState(COLOR_OPTIONS[0]);
  const [message, setMessage] = useState("");
  const [recipientName, setRecipientName] = useState("");

  if (!product) {
    return (
      <div className="container-page py-24 text-center">
        <p className="text-ink/70 mb-6">Cette box n'existe pas (ou plus).</p>
        <Link to="/nos-box" className="text-forest font-medium hover:underline">
          ← Retour au catalogue
        </Link>
      </div>
    );
  }

  const handleAdd = () => {
    // La personnalisation (couleur, message) est capturée ici en local.
    // À l'étape 7 du guide, on l'enverra vers Supabase avec la commande.
    addItem(product);
    navigate("/panier");
  };

  return (
    <section className="container-page py-16 md:py-20 grid md:grid-cols-2 gap-14">
      <div className="bg-cream-soft rounded-xl2 flex flex-col items-center justify-center gap-6 p-12 md:p-16">
        {/* Aperçu en direct du prénom (uniquement si un prénom est tapé) */}
        <BubbleText
          text={recipientName}
          tone="rouge"
          className="text-4xl md:text-5xl"
        />
        <img
          src={product.image}
          alt={product.name}
          className="product-card__img w-full max-w-sm object-contain"
        />
      </div>

      <div>
        <Link to="/nos-box" className="text-sm text-ink/50 hover:text-forest">
          ← Toutes les box
        </Link>

        <span className="block mt-4 text-xs font-semibold tracking-wide uppercase text-coral mb-2">
          Taille {product.size}
        </span>
        <h1 className="text-3xl md:text-4xl mb-3">{product.name}</h1>
        <p className="font-display text-2xl text-forest mb-6">{product.price} €</p>
        <p className="text-ink/70 mb-8 leading-relaxed">{product.description}</p>

        <ul className="space-y-2 mb-10">
          {product.features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-ink/70">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              {f}
            </li>
          ))}
        </ul>

        <div className="space-y-6 mb-10 border-t border-forest/10 pt-8">
          <div>
            <label className="block text-sm font-medium text-forest mb-2">
              Couleur dominante
            </label>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                    color === c
                      ? "bg-forest text-cream border-forest"
                      : "border-forest/20 text-ink/70 hover:border-forest"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-forest mb-2">
              Prénom sur la box (facultatif)
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              maxLength={18}
              placeholder="Ex. : Sarah — aperçu en direct à gauche"
              className="w-full rounded-xl border border-forest/20 p-3 text-sm focus:border-forest outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-forest mb-2">
              Pour quelle occasion ? (facultatif)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="Dites-nous-en un peu plus, ou laissez vide — ça marche pour tout !"
              className="w-full rounded-xl border border-forest/20 p-3 text-sm focus:border-forest outline-none"
            />
          </div>
        </div>

        <button
          onClick={handleAdd}
          className="w-full md:w-auto rounded-full bg-forest text-cream px-8 py-3.5 font-medium hover:bg-forest-light transition-colors"
        >
          Ajouter au panier
        </button>
      </div>
    </section>
  );
}
