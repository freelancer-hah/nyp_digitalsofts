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
        serif: ['"Playfair Display"', '"Cinzel"', 'Georgia', 'serif'],
        cursive: ['"Alex Brush"', 'cursive', 'serif'],
      },
      colors: {
        nyp: {
          bg: "#041a10",
          card: "#062316",
          dark: "#03140e",
          forest: "#052818",
          border: "rgba(16, 185, 129, 0.2)",
          emerald: "#059669",
          bright: "#10b981",
          gold: "#c59b27",
          goldHover: "#b48b1e",
          amber: "#d97706",
          goldlight: "#fef9c3",
          accent: "#047857",
          cream: "#f6f4ee",
          creamCard: "#faf8f3",
          creamBorder: "#e6e1d5",
          sand: "#f0ece1"
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
