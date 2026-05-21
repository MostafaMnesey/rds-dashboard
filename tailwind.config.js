/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
    },
    extend: {
      colors: {
        main: "#68bc52",
        secondary: "#93979a",
        "soft-black": "#2d2d2d",
        "off-white": "#f4f3f0",
      },
      fontFamily: {
        poppins: ["Poppins", "system-ui", "sans-serif"],
        oswald: ["Oswald", "system-ui", "sans-serif"],
        garamond: ["EB Garamond", "Georgia", "serif"],
      },
      boxShadow: {
        "rds-sm": "0 4px 16px rgba(0, 0, 0, 0.03)",
        "rds-md": "0 4px 16px rgba(0, 0, 0, 0.04)",
        "rds-lg": "0 8px 24px rgba(0, 0, 0, 0.06)",
        "rds-cta": "0 8px 20px rgba(104, 188, 82, 0.18)",
        "rds-cta-hover": "0 10px 24px rgba(104, 188, 82, 0.25)",
      },
      screens: {
        xsm: "450px",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out forwards",
      },
    },
  },
  plugins: [],
};