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
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          dark: {
            500: "#60a5fa", // Lighter in dark mode
            600: "#3b82f6",
            700: "#2563eb",
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
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
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
