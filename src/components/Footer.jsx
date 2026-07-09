import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-forest text-cream mt-24">
      <div aria-hidden className="h-1.5 bg-gradient-to-r from-coral via-gold to-rose" />
      <div className="container-page py-16 grid gap-12 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl mb-3">Grande Box</p>
          <p className="text-cream/70 text-sm leading-relaxed max-w-xs">
            Des box cadeaux géantes, personnalisables, pour toutes les occasions.
            Choisissez votre taille, on s'occupe de l'effet wow.
          </p>
        </div>

        <div>
          <p className="font-medium mb-4 text-gold">Navigation</p>
          <ul className="space-y-2 text-sm text-cream/70">
            <li><Link to="/" className="hover:text-cream">Accueil</Link></li>
            <li><Link to="/nos-box" className="hover:text-cream">Nos Box</Link></li>
            <li><Link to="/contact" className="hover:text-cream">Contact</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-medium mb-4 text-gold">Contact</p>
          <ul className="space-y-2 text-sm text-cream/70">
            <li>contact@grandebox.fr</li>
            <li>Livraison partout en France</li>
          </ul>
        </div>
      </div>

      <div className="container-page py-6 border-t border-cream/10 text-xs text-cream/50 flex flex-wrap gap-2 justify-between">
        <p>© {new Date().getFullYear()} Grande Box. Tous droits réservés.</p>
        <p>Nom de marque à confirmer — voir la page Cahier des charges dans Notion.</p>
      </div>
    </footer>
  );
}
