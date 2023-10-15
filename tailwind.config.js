/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,vue}"],

  theme: {
    extend: {
      fontFamily: {
        nunito: ["Nunito", "sans-serif"],
        sans: ["Nunito Sans", "sans-serif"],
      },
    },
  },

  plugins: [],
};
