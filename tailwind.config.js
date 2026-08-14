/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/pages/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#16324F",        // deep majolica blue — headers, nav
        registan: "#3A8FA0",   // turquoise tile accent
        plaster: "#F3ECDD",    // warm plaster background
        clay: "#B5563C",       // terracotta accent — actions, highlights
        night: "#241F1C",      // near-black text
        sand: "#DCCFAF",       // borders, dividers
        trust: {
          high: "#2F6F4E",
          medium: "#B98A2A",
          low: "#9C3B3B",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      backgroundImage: {
        girih: "radial-gradient(circle at 1px 1px, rgba(22,50,79,0.14) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};
