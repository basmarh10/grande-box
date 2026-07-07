import { lazy, Suspense, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Reveal from "../components/Reveal";

// Chargé en lazy : Three.js (~1 Mo) ne bloque plus le premier affichage du site.
const ScrollScene = lazy(() => import("../three/ScrollScene"));
import { useLenis } from "../lib/useLenis";
import { initScrollProgress } from "../lib/scrollProgress";
import { products } from "../data/products";

const STEPS = [
  { n: "01", title: "Choisissez votre taille", text: "M, L, XL ou XXL : une box géante pour chaque envie et chaque budget." },
  { n: "02", title: "Personnalisez-la", text: "Couleurs, message, contenu : dites-nous pour quelle occasion, on adapte tout." },
  { n: "03", title: "Livraison partout en France", text: "Votre box arrive prête à l'emploi, à la date de votre choix." },
  { n: "04", title: "L'effet Wow", text: "Ouvrez, surprenez, gardez le souvenir. Peu importe l'occasion." },
];

export default function Home() {
  const pageRef = useRef(null);

  // Scroll fluide (Lenis) + branchement du scroll global sur la scène 3D
  useLenis();
  useEffect(() => {
    if (!pageRef.current) return;
    const cleanup = initScrollProgress(pageRef.current);
    return cleanup;
  }, []);

  return (
    <div ref={pageRef} className="relative">
      {/* Canvas 3D fixe en fond, piloté par le scroll de toute la page */}
      <Suspense fallback={null}>
        <ScrollScene />
      </Suspense>

      {/* Hero : la boîte s'ouvre et les ballons s'envolent en scrollant */}
      <section className="relative min-h-[100svh] flex flex-col justify-center">
        <div className="container-page">
          <div className="max-w-xl">
            <span className="inline-block text-xs font-semibold tracking-wide uppercase text-coral bg-coral/10 backdrop-blur px-3 py-1 rounded-full mb-6">
              Pour toutes les occasions, sans exception
            </span>
            <h1 className="text-4xl md:text-6xl leading-tight mb-6">
              La même grosse surprise, quelle que soit la fête.
            </h1>
            <p className="text-ink/70 text-lg mb-8 max-w-md">
              Nos box cadeaux géantes s'adaptent à vous, pas l'inverse. Choisissez une
              taille, personnalisez le reste — et scrollez pour l'ouvrir.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/nos-box"
                className="rounded-full bg-forest text-cream px-7 py-3.5 font-medium hover:bg-forest-light transition-colors"
              >
                Découvrir nos box
              </Link>
              <Link
                to="/contact"
                className="rounded-full border border-forest text-forest px-7 py-3.5 font-medium hover:bg-forest hover:text-cream transition-colors"
              >
                Une demande particulière ?
              </Link>
            </div>
          </div>
        </div>

        <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.2em] text-ink/40 animate-bounce">
          Scrollez ↓
        </p>
      </section>

      {/* La boîte a fini de s'ouvrir, les ballons s'envolent : on enchaîne sur le récit */}
      <section className="relative min-h-[70vh] flex items-center">
        <div className="container-page grid md:grid-cols-2 gap-12">
          <div />
          <Reveal>
            <p className="text-xs font-semibold tracking-widest uppercase text-coral mb-3">
              L'effet Grande Box
            </p>
            <h2 className="text-3xl md:text-4xl mb-4 max-w-md">
              Un coffret, un vrai moment.
            </h2>
            <p className="text-ink/70 max-w-md">
              Pas un colis de plus. On conçoit chaque box pour l'instant où elle
              s'ouvre — le vôtre, ou celui de la personne à qui vous l'offrez.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="relative bg-cream-soft/95 backdrop-blur-sm py-24">
        <div className="container-page">
          <Reveal>
            <p className="text-xs font-semibold tracking-widest uppercase text-coral mb-3">
              Simple et rapide
            </p>
            <h2 className="text-3xl md:text-4xl mb-14 max-w-xl">Comment ça marche ?</h2>
          </Reveal>

          <div className="grid md:grid-cols-4 gap-10">
            {STEPS.map((step, i) => (
              <Reveal key={step.n} delay={i * 0.08}>
                <p className="font-display text-4xl text-gold mb-4">{step.n}</p>
                <h3 className="font-display text-xl text-forest mb-2">{step.title}</h3>
                <p className="text-sm text-ink/60 leading-relaxed">{step.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Produits phares */}
      <section className="relative bg-cream py-24">
        <div className="container-page">
          <Reveal>
            <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-coral mb-3">
                  Notre gamme
                </p>
                <h2 className="text-3xl md:text-4xl">Une taille pour chaque envie</h2>
              </div>
              <Link to="/nos-box" className="text-forest font-medium hover:underline">
                Voir tout le catalogue →
              </Link>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p, i) => (
              <Reveal key={p.id} delay={Math.min(i, 3) * 0.06}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA finale */}
      <section className="relative bg-cream py-4 pb-24">
        <div className="container-page">
          <Reveal>
            <div className="bg-forest rounded-xl2 px-10 py-16 text-center">
              <h2 className="text-cream text-3xl md:text-4xl mb-4">Prêt à faire sensation ?</h2>
              <p className="text-cream/70 mb-8 max-w-md mx-auto">
                Dites-nous pour quelle occasion — ou pour aucune occasion en particulier —
                et on s'occupe du reste.
              </p>
              <Link
                to="/contact"
                className="inline-block rounded-full bg-gold text-forest px-8 py-3.5 font-medium hover:brightness-105 transition"
              >
                Parlons de votre box
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
