import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
      },
      keyframes: {
        blob1: {
          "0%, 100%": { transform: "translate(0,0) scale(1)" },
          "33%": { transform: "translate(40px,-30px) scale(1.1)" },
          "66%": { transform: "translate(-30px,40px) scale(0.95)" },
        },
        blob2: {
          "0%, 100%": { transform: "translate(0,0) scale(1)" },
          "50%": { transform: "translate(-60px,30px) scale(1.15)" },
        },
        blob3: {
          "0%, 100%": { transform: "translate(0,0) scale(1)" },
          "50%": { transform: "translate(30px,40px) scale(0.9)" },
        },
      },
      animation: {
        blob1: "blob1 14s ease-in-out infinite",
        blob2: "blob2 18s ease-in-out infinite",
        blob3: "blob3 22s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
