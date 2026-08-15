/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/pages/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Silk Road Authentic Palette ("Шёлковый путь")
        primary: {
          DEFAULT: "#C1622E",   // Terracotta primary
          hover: "#A8531F",
        },
        secondary: {
          DEFAULT: "#2E4374",   // Indigo secondary
          hover: "#253658",
        },
        terracotta: {
          DEFAULT: "#C1622E",
          hover: "#A8531F",
          dark: "#A8531F",
        },
        indigo: {
          DEFAULT: "#2E4374",
          hover: "#253658",
          dark: "#1E2C4D",
        },
        sand: {
          DEFAULT: "#F2E9DA",   // Warm neutral parchment
          border: "#DDCBAF",
        },
        ink: {
          DEFAULT: "#241C15",   // Deep warm ink text
          muted: "#6B5D4F",
        },

        // Theme alias mappings
        majolica: {
          DEFAULT: "#C1622E",   // Mapped to Terracotta primary
          hover: "#A8531F",
        },
        gold: {
          DEFAULT: "#2E4374",   // Mapped to Indigo secondary
          dark: "#253658",
        },
        paper: "#F2E9DA",
        night: "#241C15",
        brick: "#C1622E",

        trust: {
          high: "#2E4374",
          medium: "#C1622E",
          low: "#A8531F",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Spectral", "serif"],
        body: ["var(--font-body)", "Manrope", "sans-serif"],
        mono: ["var(--font-utility)", "IBM Plex Mono", "monospace"],
        utility: ["var(--font-utility)", "IBM Plex Mono", "monospace"],
      },
      backgroundImage: {
        girih: "radial-gradient(circle at 1px 1px, rgba(193,98,46,0.12) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};
