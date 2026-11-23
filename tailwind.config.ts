import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Display"',
          '"SF Pro Text"',
          "Inter",
          "system-ui",
          "sans-serif",
        ],
      },
      colors: {
        apple: {
          bg: "#F5F5F7",
          darkBg: "#000000",
          darkCard: "#1C1C1E",
          blue: "#0071E3",
          blueHover: "#0077ED",
          gray: "#86868B",
          text: "#1D1D1F",
          darkText: "#F5F5F7",
        },
      },
      boxShadow: {
        "liquid-light":
          "0 20px 50px rgba(0, 0, 0, 0.06), 0 4px 16px rgba(0, 0, 0, 0.04), inset 0 1px 1px rgba(255, 255, 255, 0.85)",
        "liquid-dark":
          "0 24px 60px rgba(0, 0, 0, 0.65), 0 4px 20px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.22)",
        "glass-pill":
          "0 12px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06), inset 0 1px 1px rgba(255, 255, 255, 0.7)",
        "portrait-3d":
          "0 35px 70px -15px rgba(0, 113, 227, 0.22), 0 20px 40px -15px rgba(0, 0, 0, 0.15)",
      },
      borderRadius: {
        "3xl": "24px",
        "4xl": "32px",
      },
    },
  },
  plugins: [],
};

export default config;
