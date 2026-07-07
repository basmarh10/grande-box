/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette A « Ruban Rouge » — validée par Basma (Checkpoint 0 bis)
        // Crème = fond prédominant. Noir = texte/contours, jamais en grands
        // aplats d'interface. Rouge = couleur d'action. Or + rose = touches fun.
        // Les noms historiques des tokens sont conservés pour que tous les
        // composants héritent de la palette sans modification individuelle.
        cream: "#F8F3E9",          // fond principal
        "cream-soft": "#F0E8D8",   // fonds secondaires / cadres produits
        ivory: "#FFFDF8",          // cards
        forest: "#111111",         // noir — titres et éléments principaux
        "forest-light": "#2E2A26", // variante hover du noir
        gold: "#D9A441",           // accent or
        coral: "#D6252E",          // rouge ruban — couleur d'action (CTA)
        rose: "#F2A9B4",           // rose dragée — accent fun
        ink: "#1A1714",            // texte courant — noir chaud
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
