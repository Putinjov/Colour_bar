/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: "#F6C445",
          purple: "#de90f6",

          bg: "#F7F4EF",
          surface: "#FFFFFF",
          muted: "#F1EEE8",
          ink: "#14121A",
          sub: "#6B6676",
          line: "rgba(20,18,26,0.10)",
        },
      },
      borderRadius: { xl2: "0.25rem" },
      boxShadow: {
        soft: "8px 8px 0 rgba(0,0,0,0.22)",
      },
    },
  },
  plugins: [],
};
