/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb", // azul
        secondary: "#64748b", // gris
        success: "#22c55e", // verde
        warning: "#eab308", // amarillo
        danger: "#ef4444", // rojo
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"], // si quieres usar Inter, instálalo desde Google Fonts
      },
    },
  },
  plugins: [],
};