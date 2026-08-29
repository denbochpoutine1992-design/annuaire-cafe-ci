/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#2B1B14",
        paper: "#F6EEDD",
        paperRaised: "#FBF5E9",
        gold: "#C68A2E",
        clay: "#B85C38",
        forest: "#275C43",
        line: "#DCC79E",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Work Sans", "sans-serif"],
        mono: ["Space Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
