import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cp: {
          blue: "#2896e0",
          "dark-blue": "#1a6fb5",
          navy: "#0d4a8a",
          sky: "#c8eeff",
          "sky-light": "#e8f7ff",
        },
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', "monospace"],
        vt: ["VT323", "monospace"],
        nunito: ["Nunito", "sans-serif"],
        caveat: ["Caveat", "cursive"],
      },
      boxShadow: {
        cp: "0 4px 0 #0d4a8a",
        "cp-hover": "0 6px 0 #0d4a8a",
      },
    },
  },
  plugins: [],
};

export default config;
