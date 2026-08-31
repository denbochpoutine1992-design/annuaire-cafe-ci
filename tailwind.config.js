/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#18181B",
        paper: "#FAFAF9",
        paperRaised: "#FFFFFF",
        gold: "#F59E0B",
        clay: "#C2410C",
        forest: "#15803D",
        line: "#E7E5E4",
      },
      fontFamily: {
        display: ["Plus Jakarta Sans", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
