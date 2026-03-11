import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Primary theme colors */
        primary: {
          50: "#fdf2f8",
          100: "#fce7f3",
          500: "#ec4899",
          600: "#db2777",
          700: "#be185d",
          DEFAULT: "#ec4899",
        },
        accent: "#a78bfa",
        success: "#4ade80",
        warning: "#fb923c",
        danger: "#f87171",
        /* Dark theme backgrounds */
        dark: {
          50: "#f5f5f5",
          100: "#efefef",
          800: "#1a1a2e",
          900: "#0f0f1e",
          DEFAULT: "#1a1a2e",
        },
        /* Semantic colors */
        bg: {
          primary: "#0f0f1e",
          secondary: "#14142a",
          tertiary: "#1a1a2e",
        },
        text: {
          primary: "#ffffff",
          secondary: "rgba(255, 255, 255, 0.7)",
          tertiary: "rgba(255, 255, 255, 0.4)",
        },
        border: "rgba(255, 255, 255, 0.1)",
      },
      fontFamily: {
        sans: ["'Inter'", "system-ui", "-apple-system", "sans-serif"],
        serif: ["'Merriweather'", "serif"],
        display: ["'Playfair Display'", "serif"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem", letterSpacing: "0.5px" }],
        sm: ["0.875rem", { lineHeight: "1.25rem", letterSpacing: "0.15px" }],
        base: ["1rem", { lineHeight: "1.5rem", letterSpacing: "0.2px" }],
        lg: ["1.125rem", { lineHeight: "1.75rem", letterSpacing: "0.3px" }],
        xl: ["1.25rem", { lineHeight: "1.75rem", letterSpacing: "0.5px" }],
        "2xl": ["1.5rem", { lineHeight: "2rem", letterSpacing: "0.6px" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem", letterSpacing: "0.75px" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem", letterSpacing: "0.9px" }],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in",
        "pulse-subtle": "pulseSoft 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
