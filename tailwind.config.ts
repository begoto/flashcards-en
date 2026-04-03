/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Palette principale FlashCards EN
        sky: {
          primary: "#87CEEB",   // Bleu ciel principal
          light:   "#C9E8F6",   // Bleu ciel clair (hover, bg léger)
          dark:    "#5BAED6",   // Bleu ciel foncé (actif, bordures)
        },
        correct: "#22C55E",     // Vert — bonne réponse
        wrong:   "#EF4444",     // Rouge — mauvaise réponse
        gold:    "#FFD700",     // Or — étoiles / récompenses
        neutral: {
          ink:   "var(--color-ink)",    // adapte light/dark auto
          muted: "var(--color-muted)",
          soft:  "var(--color-soft)",
          line:  "var(--color-line)",
        },
        surface: {
          DEFAULT: "var(--color-surface)",   // bg-surface (remplace bg-white en dark)
          raised:  "var(--color-surface-raised)",
        },
      },
      fontFamily: {
        sans: ["'Nunito'", "sans-serif"],
        display: ["'Poppins'", "sans-serif"],
      },
      keyframes: {
        flipIn: {
          "0%":   { transform: "rotateY(90deg)", opacity: "0" },
          "100%": { transform: "rotateY(0deg)",  opacity: "1" },
        },
        slideUp: {
          "0%":   { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)",    opacity: "1" },
        },
        pulse3D: {
          "0%, 100%": { transform: "scale(1)" },
          "50%":      { transform: "scale(1.04)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        flipIn:  "flipIn 0.4s ease-out",
        slideUp: "slideUp 0.3s ease-out",
        pulse3D: "pulse3D 0.6s ease-in-out",
        shimmer: "shimmer 2s infinite linear",
      },
    },
  },
  plugins: [],
};
