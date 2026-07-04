/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FBF6EC",
        "cream-soft": "#F3ECDD",
        forest: "#163828",
        "forest-light": "#1F4A34",
        gold: "#D9A441",
        coral: "#E8583F",
        ink: "#16241D",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Plus Jakarta Sans", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
}

