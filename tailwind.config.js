/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette « Mix coloré » — validée par Basma (v3, juillet 2026).
        // Les noms historiques des tokens sont conservés pour que tous les
        // composants héritent de la palette sans modification individuelle :
        // `forest` porte désormais le PRUNE (qui remplace le noir partout,
        // plus aucun grand aplat #111), `coral` reste la couleur d'action.
        cream: "#FBF5EA",          // fond dominant
        "cream-soft": "#F4ECDC",   // fonds secondaires / cadres produits
        ivory: "#FFFDF8",          // cards
        forest: "#4A1942",         // prune profond — titres, CTA bandeau, footer
        "forest-light": "#63265A", // variante hover du prune
        coral: "#F0483D",          // corail — action principale (boutons CTA)
        turquoise: "#2EC4B6",      // accent secondaire (boutons secondaires, badges)
        sun: "#FFC93C",            // jaune soleil — accent tertiaire
        violet: "#8E5FD1",         // accent créatif
        bubblegum: "#FF6FA0",      // rose bonbon — touches fun (hover, ballons)
        rose: "#FF6FA0",           // alias historique → rose bonbon
        gold: "#E8B84B",           // or — rubans / éléments précieux
        ink: "#3D2038",            // texte courant — prune assombri
      },
      fontFamily: {
        display: ["Cormorant Garamond", "serif"],
        body: ["Plus Jakarta Sans", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
}
