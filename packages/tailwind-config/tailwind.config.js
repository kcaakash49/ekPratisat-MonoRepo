/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    // This will be overridden by each app
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        bounceDelay: {
          "0%, 80%, 100%": { transform: "scaleY(0.3)" },
          "40%": { transform: "scaleY(1)" },
        },
      },
      animation: {
        bounceDelay: "bounceDelay 1s infinite ease-in-out",
      },
      backgroundImage: {
        // The metallic gradient you requested
        // "gold-gradient":
        //   "linear-gradient(135deg, hsl(38 70% 50%), hsl(38 60% 70%))",
        "gold-gradient":
          "linear-gradient(135deg, #EBC044 0%, #F4CA3B 28%, #FFD33A 55%, #F4DC91 78%, #F4CA3B 100%)",
        // A slightly deeper version for interactive states
        // "gold-gradient-hover":
        //   "linear-gradient(135deg, hsl(38 70% 45%), hsl(38 60% 65%))",
        "gold-gradient-hover":
          "linear-gradient(135deg, #E4B424 0%, #F0C030 34%, #FCCC24 62%, #F0D884 82%, #EBC044 100%)",
      },
      colors: {
        primary: {
          50: "#fff8e1",
          100: "#f8e8a5",
          200: "#efd675",
          300: "#e5b83e",
          400: "#d6a936",
          500: "#c99a2e",
          600: "#b98a00",
          700: "#8a5a00",
          800: "#624109",
          900: "#2a241b",
          dark: {
            500: "#efc75a",
            600: "#e5b83e",
            700: "#c99a2e",
          },
        },
        secondary: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
        gold: {
          DEFAULT: "#F0C030", // Accessible via 'bg-gold' or 'text-gold'
          50: "#FFF9DE",
          100: "#FFF0AD",
          200: "#F7DF84",
          300: "#F0D884",
          400: "#FCCC24",
          500: "#F0C030", // Same as DEFAULT
          600: "#E4B424",
          700: "#B98A00",
          800: "#906C00",
          900: "#463500",
          950: "#020617",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        serif: ["Georgia", "ui-serif", "serif"],
        mono: ["Fira Code", "ui-monospace", "SFMono-Regular"],
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
