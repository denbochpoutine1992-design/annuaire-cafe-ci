/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#18181B",
        paper: "#FAFAFA",
        paperRaised: "#FFFFFF",
        gold: "#18181B",
        clay: "#18181B",
        forest: "#3F3F46",
        line: "#E4E4E7",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
