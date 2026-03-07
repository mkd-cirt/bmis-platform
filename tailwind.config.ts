import type { Config } from "tailwindcss";
const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    "glass","glass-md","glass-hover","gradient-text","grid-bg",
    "glow-blue","text-glow","font-display","font-mono",
    "animate-fade-up","animate-fade-in","animate-pulse-orb","animate-spin-slow",
    "btn-primary","btn-ghost","input","sidebar-item",
    "progress-track","progress-fill",
    "badge","badge-critical","badge-high","badge-medium","badge-low",
    "badge-done","badge-partial","badge-missing","badge-na",
    "delay-1","delay-2","delay-3","delay-4","delay-5","delay-6",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Syne", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        sans: ["DM Sans", "sans-serif"],
      },
      colors: {
        navy: {
          DEFAULT: "#080f1e",
          mid: "#0d1a35",
          light: "#122040",
        },
      },
      animation: {
        "fade-up":    "fadeUp 0.6s ease both",
        "fade-in":    "fadeIn 0.4s ease both",
        "pulse-orb":  "pulseOrb 5s ease-in-out infinite",
        "spin-slow":  "spinSlow 25s linear infinite",
      },
      keyframes: {
        fadeUp:   { from:{ opacity:"0", transform:"translateY(20px)" }, to:{ opacity:"1", transform:"translateY(0)" } },
        fadeIn:   { from:{ opacity:"0" }, to:{ opacity:"1" } },
        pulseOrb: { "0%,100%":{ opacity:".12", transform:"scale(1)" }, "50%":{ opacity:".25", transform:"scale(1.08)" } },
        spinSlow: { from:{ transform:"rotate(0deg)" }, to:{ transform:"rotate(360deg)" } },
      },
    },
  },
  plugins: [],
};
export default config;
