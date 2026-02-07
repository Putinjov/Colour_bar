/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: "#F6C445",
          purple: "#6D28D9",

          bg: "#F7F4EF",        // головний фон
          surface: "#FFFFFF",   // картки
          muted: "#F1EEE8",     // секції/підкладки
          ink: "#14121A",       // текст
          sub: "#6B6676",       // secondary text
          line: "rgba(20,18,26,0.10)", // бордери
        },
      },
      borderRadius: { xl2: "1.25rem" },
      boxShadow: {
        soft: "0 18px 45px rgba(20,18,26,0.10)",
      },
    },
  },
  plugins: [],
};

