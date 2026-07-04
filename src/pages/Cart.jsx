import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { items, updateQty, removeItem, total } = useCart();
  const [checkoutMessage, setCheckoutMessage] = useState(false);

  if (items.length === 0) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="text-3xl mb-4">Votre panier est vide</h1>
        <p className="text-ink/60 mb-8">Encore aucune box sélectionnée.</p>
        <Link
          to="/nos-box"
          className="inline-block rounded-full bg-forest text-cream px-7 py-3.5 font-medium hover:bg-forest-light transition-colors"
        >
          Voir le catalogue
        </Link>
      </div>
    );
  }

  return (
    <section className="container-page py-16 md:py-20 grid md:grid-cols-3 gap-12">
      <div className="md:col-span-2 space-y-6">
        <h1 className="text-3xl mb-4">Votre panier</h1>

        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between bg-white rounded-xl2 p-5 shadow-sm"
          >
            <div>
              <p className="font-display text-lg text-forest">{item.name}</p>
              <p className="text-sm text-ink/50">Taille {item.size} · {item.price} €</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => updateQty(item.id, item.qty - 1)}
                className="w-8 h-8 rounded-full border border-forest/20 text-forest hover:bg-cream-soft"
                aria-label="Diminuer la quantité"
              >
                −
              </button>
              <span className="w-6 text-center">{item.qty}</span>
              <button
                onClick={() => updateQty(item.id, item.qty + 1)}
                className="w-8 h-8 rounded-full border border-forest/20 text-forest hover:bg-cream-soft"
                aria-label="Augmenter la quantité"
              >
                +
              </button>
              <button
                onClick={() => removeItem(item.id)}
                className="ml-4 text-sm text-ink/40 hover:text-coral"
              >
                Retirer
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-cream-soft rounded-xl2 p-8 h-fit">
        <h2 className="font-display text-xl text-forest mb-6">Résumé</h2>
        <div className="flex justify-between mb-2 text-sm text-ink/70">
          <span>Sous-total</span>
          <span>{total} €</span>
        </div>
        <div className="flex justify-between mb-6 text-sm text-ink/70">
          <span>Livraison</span>
          <span>Calculée à l'étape suivante</span>
        </div>
        <div className="flex justify-between font-display text-lg text-forest border-t border-forest/10 pt-4 mb-8">
          <span>Total</span>
          <span>{total} €</span>
        </div>

        <button
          onClick={() => setCheckoutMessage(true)}
          className="w-full rounded-full bg-forest text-cream py-3.5 font-medium hover:bg-forest-light transition-colors"
        >
          Passer commande
        </button>

        {checkoutMessage && (
          <p className="text-xs text-ink/50 mt-4 leading-relaxed">
            Le paiement en ligne (Stripe) n'est pas encore branché — c'est l'étape 8
            du guide de développement, une fois Supabase connecté à l'étape 7.
          </p>
        )}
      </div>
    </section>
  );
}
