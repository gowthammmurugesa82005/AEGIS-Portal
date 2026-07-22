import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // AEGIS brand palette
        aegis: {
          navy:    "#1B3A6B",
          gold:    "#C9A84C",
          dark:    "#0D1F3C",
          light:   "#EBF0F8",
        },
        // Semantic status colours
        status: {
          green:   "#1A7A4A",
          amber:   "#C97B22",
          red:     "#B22222",
          blue:    "#1D6FA8",
          "green-bg": "#E8F5EE",
          "amber-bg": "#FEF3E2",
          "red-bg":   "#FDEAEA",
          "blue-bg":  "#E8F0FA",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        card: "0 2px 8px rgba(27,58,107,0.10)",
        "card-hover": "0 4px 16px rgba(27,58,107,0.18)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
        "fade-in":    "fadeIn 0.3s ease-in-out",
        "slide-in":   "slideIn 0.25s ease-out",
      },
      keyframes: {
        fadeIn:  { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideIn: { "0%": { transform: "translateY(-8px)", opacity: "0" }, "100%": { transform: "translateY(0)", opacity: "1" } },
      },
    },
  },
  plugins: [],
};

export default config;
