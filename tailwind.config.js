/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
        heading: ['"Outfit"', 'sans-serif'],
      },
      colors: {
        nyp: {
          bg: "#030e09",
          card: "#081d14",
          border: "rgba(16, 185, 129, 0.2)",
          emerald: "#059669",
          bright: "#10b981",
          gold: "#f59e0b",
          goldlight: "#fbbf24",
          accent: "#047857"
        }
      },
      boxShadow: {
        'glow-emerald': '0 0 30px -5px rgba(16, 185, 129, 0.3)',
        'glow-gold': '0 0 30px -5px rgba(245, 158, 11, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      }
    },
  },
  plugins: [],
}
