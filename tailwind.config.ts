import type { Config } from "tailwindcss";
const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    "glass","glass-md","glass-hover","gradient-text","grid-bg",
    "font-display","font-mono",
    "card","card-hover","domain-icon",
    "section-label","section-title","section-desc","divider",
    "animate-fade-up","animate-fade-in",
    "btn-primary","btn-ghost","input","sidebar-item",
    "progress-track","progress-fill",
    "badge","badge-critical","badge-high","badge-medium","badge-low",
    "badge-done","badge-partial","badge-missing","badge-na",
    "delay-1","delay-2","delay-3","delay-4","delay-5","delay-6",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      colors: {
        navy: {
          DEFAULT: "#0a0f1a",
          mid: "#0f1629",
          light: "#151d33",
        },
      },
      animation: {
        "fade-up":  "fadeUp 0.5s ease both",
        "fade-in":  "fadeIn 0.3s ease both",
      },
      keyframes: {
        fadeUp: { from:{ opacity:"0", transform:"translateY(12px)" }, to:{ opacity:"1", transform:"translateY(0)" } },
        fadeIn: { from:{ opacity:"0" }, to:{ opacity:"1" } },
      },
    },
  },
  plugins: [],
};
export default config;
