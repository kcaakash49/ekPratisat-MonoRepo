import sharedConfig from "@repo/tailwind-config";

/** @type {import('tailwindcss').Config} */
export default {
  ...sharedConfig,
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Shared packages content
    "../../packages/ui/**/*.{js,ts,jsx,tsx}",
    "../../packages/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      ...sharedConfig.theme.extend,
      // Bundled brand fonts (variables set by next/font in app/layout.tsx).
      // Devanagari (Lohit) is appended so Nepali renders consistently too.
      fontFamily: {
        ...(sharedConfig.theme?.extend?.fontFamily ?? {}),
        sans: [
          "var(--font-sans)",
          "var(--font-devanagari)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
