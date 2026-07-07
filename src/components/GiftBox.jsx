// Illustration SVG réutilisable d'une boîte cadeau, recolorable via la prop `tone`.
// Évite de dépendre de vraies photos produit (à faire plus tard, voir le guide de développement).

const TONES = {
  forest: { box: "#111111", ribbon: "#D9A441" },
  gold: { box: "#D9A441", ribbon: "#111111" },
  coral: { box: "#D6252E", ribbon: "#F8F3E9" },
};

export default function GiftBox({ tone = "forest", className = "" }) {
  const { box, ribbon } = TONES[tone] ?? TONES.forest;

  return (
    <svg
      viewBox="0 0 200 180"
      className={className}
      role="img"
      aria-label="Illustration d'une boîte cadeau"
    >
      <rect x="20" y="70" width="160" height="100" rx="10" fill={box} />
      <rect x="10" y="40" width="180" height="36" rx="10" fill={box} opacity="0.9" />
      <rect x="92" y="40" width="16" height="130" fill={ribbon} />
      <rect x="10" y="52" width="180" height="16" fill={ribbon} />
      <path
        d="M100 40 C 70 10, 40 15, 55 35 C 65 48, 90 46, 100 40 Z"
        fill={ribbon}
      />
      <path
        d="M100 40 C 130 10, 160 15, 145 35 C 135 48, 110 46, 100 40 Z"
        fill={ribbon}
      />
    </svg>
  );
}
