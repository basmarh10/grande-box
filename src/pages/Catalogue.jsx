import ProductCard from "../components/ProductCard";
import { products } from "../data/products";

export default function Catalogue() {
  return (
    <section className="container-page py-16 md:py-20">
      <p className="text-xs font-semibold tracking-widest uppercase text-coral mb-3">
        Nos Box
      </p>
      <h1 className="text-3xl md:text-4xl mb-4 max-w-xl">
        Une taille pour chaque envie, une box pour toutes les occasions
      </h1>
      <p className="text-ink/70 max-w-xl mb-14">
        Pas de catégorie par événement ici : nos box sont pensées pour s'adapter à
        n'importe quelle occasion. Choisissez d'abord la taille, on personnalise le
        reste ensemble.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
