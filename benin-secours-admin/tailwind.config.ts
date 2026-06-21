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
        primary: {
          DEFAULT: "#FFFF00",
          50: "#FFFFE6",
          100: "#FFFFCC",
          200: "#FFFF99",
          300: "#FFFF66",
          400: "#FFFF33",
          500: "#FFFF00",
          600: "#CCCC00",
          700: "#999900",
          800: "#666600",
          900: "#333300",
        },
        dark: {
          bg: "#0F0F0E",
          card: "#1C1C1A",
          border: "#2D2D2A",
        },
        status: {
          en_attente: "#F59E0B",
          acceptee: "#3B82F6",
          en_cours: "#8B5CF6",
          completee: "#10B981",
          annulee: "#EF4444",
          valide: "#10B981",
          suspendu: "#EF4444",
          rejete: "#6B7280",
        },
      },
    },
  },
  plugins: [],
};

export default config;
