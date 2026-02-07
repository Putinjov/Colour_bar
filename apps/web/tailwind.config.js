/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: "#F6C445",
          purple: "#6D28D9",
          ink: "#0B0B12",
          paper: "#0F1020",
        },
      },
      borderRadius: { xl2: "1.25rem" },
      boxShadow: { soft: "0 10px 30px rgba(0,0,0,0.35)" },
    },
  },
  plugins: [],
};
