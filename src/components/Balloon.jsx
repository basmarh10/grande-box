// Illustration SVG réutilisable d'un ballon, utilisée dans l'animation d'ouverture (BoxIntro)
// et pour de petites touches décoratives ailleurs.

export default function Balloon({ color = "#E8583F", className = "" }) {
  return (
    <svg viewBox="0 0 60 90" className={className} aria-hidden="true">
      <ellipse cx="30" cy="32" rx="28" ry="32" fill={color} />
      <path d="M30 64 L24 74 L36 74 Z" fill={color} />
      <line x1="30" y1="74" x2="30" y2="90" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}
