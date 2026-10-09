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
        background: "var(--background)",
        foreground: "var(--foreground)",
        black: {
          DEFAULT: "#000000",
          deep: "#080808",
          charcoal: "#171717",
        },
        white: {
          DEFAULT: "#ffffff",
          pure: "#ffffff",
          ivory: "#f4f1ea",
        },
        grey: {
          stone: "#b8b8b8",
          light: "#e5e5e5",
          border: "#333333",
          lightBorder: "#d4d4d4",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
        tamil: ["var(--font-noto-tamil)", "sans-serif"],
      },
      transitionTimingFunction: {
        'cinematic': 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
