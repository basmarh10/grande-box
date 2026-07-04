import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";

const navLinks = [
  { to: "/", label: "Accueil" },
  { to: "/nos-box", label: "Nos Box" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur border-b border-forest/10">
      <div className="container-page flex items-center justify-between h-20">
        <Link to="/" className="font-display text-2xl text-forest">
          Grande Box
        </Link>

        <nav className="hidden md:flex items-center gap-8 font-body text-sm font-medium text-ink">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive ? "text-forest" : "text-ink/70 hover:text-forest transition-colors"
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <Link
          to="/panier"
          className="relative inline-flex items-center gap-2 rounded-full bg-forest text-cream px-5 py-2.5 text-sm font-medium hover:bg-forest-light transition-colors"
        >
          Panier
          {count > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 text-xs rounded-full bg-coral text-cream">
              {count}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
