/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/pages/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Authentic Uzbekistan Color Palette
        night: "#151C2C",       // deep dome indigo — hero background, primary dark
        majolica: "#2FA89B",    // Registan turquoise tile — primary accent
        gold: "#C99A45",        // Timurid gold — secondary accent, numbers, scores
        paper: "#F3EFE3",       // Samarkand paper parchment — warm light surfaces
        brick: "#A34B32",       // Burnt brick — focused CTA buttons

        // Compatibility aliases to ensure seamless existing component rendering
        ink: "#151C2C",
        registan: "#2FA89B",
        plaster: "#F3EFE3",
        clay: "#A34B32",
        sand: "#E2D9C8",
        trust: {
          high: "#237A57",
          medium: "#C99A45",
          low: "#A34B32",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Spectral", "serif"],
        body: ["var(--font-body)", "Manrope", "sans-serif"],
        mono: ["var(--font-utility)", "IBM Plex Mono", "monospace"],
        utility: ["var(--font-utility)", "IBM Plex Mono", "monospace"],
      },
      backgroundImage: {
        girih: "radial-gradient(circle at 1px 1px, rgba(47,168,155,0.12) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};
