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
          DEFAULT: "#0066CC",
          50: "#E6F0FA",
          100: "#CCE0F5",
          200: "#99C2EB",
          300: "#66A3E0",
          400: "#3385D6",
          500: "#0066CC",
          600: "#0052A3",
          700: "#003D7A",
          800: "#002952",
          900: "#001429",
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
