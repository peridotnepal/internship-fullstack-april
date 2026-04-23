import { fontFamily } from "html2canvas/dist/types/css/property-descriptors/font-family";

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        abhinav: "var(--font-abhinav)",
      },
    },
  },
  plugins: [],
};
