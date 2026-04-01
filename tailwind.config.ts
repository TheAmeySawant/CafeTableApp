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
        "surface": "#fdf9f2",
        "on-surface": "#1c1c18",
        "primary": "#894d00",
        "on-primary": "#ffffff",
        "outline-variant": "#d8c3b2",
        "surface-container-low": "#f7f3ec",
        "surface-container-high": "#ebe8e1",
        "surface-container-highest": "#e6e2db",
        "on-surface-variant": "#534437",
        "tertiary": "#006579",
        "secondary-container": "#f8d9d0",
      },
      fontFamily: {
        "headline": ["Noto Serif", "serif"],
        "body": ["Plus Jakarta Sans", "sans-serif"],
        "label": ["Plus Jakarta Sans", "sans-serif"]
      },
    },
  },
  plugins: [],
};
export default config;
