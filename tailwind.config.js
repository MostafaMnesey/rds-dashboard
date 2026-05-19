/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8b5cf6',
          hover: '#a78bfa',
          glow: 'rgba(139, 92, 246, 0.25)',
        },
        darkBg: {
          primary: '#0f111a',
          secondary: '#151824',
          card: 'rgba(26, 29, 46, 0.7)',
        },
        lightBg: {
          primary: '#f8fafc',
          secondary: '#ffffff',
          card: 'rgba(255, 255, 255, 0.9)',
        }
      },
      fontFamily: {
        outfit: ['Outfit', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
