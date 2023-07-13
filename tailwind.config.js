/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./login.html",
    "./src/*.{js,ts,jsx,tsx}",
    "./src/components/*.{js,ts,jsx,tsx}",
    "./src/screens/*.{js,ts,jsx,tsx}",
    "./src/LoginWindow/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("tailwind-scrollbar")({ nocompatible: true })],
};
