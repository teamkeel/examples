import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: "Recursive",
        display: "Family",
        sans: ["Inter", "sans-serif"],
      },
      textColor: {
        primary: "rgba(20, 9, 0, 0.84)",
        body: "rgba(20, 9, 0, 0.64)",
        secondary: "rgba(0, 0, 0, 0.50)",
      },
      colors: {
        sand: "#EFE7DD",
        "sand-50": "rgba(239, 231, 221, 0.50)",
        "sand-25": "rgba(239, 231, 221, 0.25)",
        "sand-dark": "#E5D9CA",
      },
      boxShadow: {
        1: "0px 1px 1px rgba(0, 0, 0, 0.01), 0px 1px 1px rgba(0, 0, 0, 0.04), 0px 0px 1px rgba(0, 0, 0, 0.14), 0px 0px 1px rgba(0, 0, 0, 0.24), 0px 0px 0px rgba(0, 0, 0, 0.27), 0px 0px 0px rgba(0, 0, 0, 0.28), 0px 2px 3px rgb(0 0 0 / 5%)",
        2: "0px 2px 4px rgba(0, 0, 0, 0.01), 0px 1px 4px rgba(0, 0, 0, 0.05), 0px 1px 3px rgba(0, 0, 0, 0.09), 0px 0px 2px rgba(0, 0, 0, 0.1), 0px 0px 0px rgba(0, 0, 0, 0.1)",
        3: "0px 7px 9px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.05), 0px 2px 6px rgba(0, 0, 0, 0.09), 0px 0px 3px rgba(0, 0, 0, 0.1), 0px 0px 0px rgba(0, 0, 0, 0.1)",
        4: "0px 17px 9px rgba(0, 0, 0, 0.01), 0px 10px 8px rgba(0, 0, 0, 0.04), 0px 4px 6px rgba(0, 0, 0, 0.07), 0px 1px 3px rgba(0, 0, 0, 0.08), 0px 0px 0px rgba(0, 0, 0, 0.08)",
        light:
          "0px 4px 9px 0px rgba(0, 0, 0, 0.05), 0px 0px 1px 0px rgba(0, 0, 0, 0.40)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
