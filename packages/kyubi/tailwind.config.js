/*
 * @Author: Kyusho 
 * @Date: 2024-02-15 14:24:22 
 * @Last Modified by: Kyusho
 * @Last Modified time: 2024-02-15 20:40:09
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/layout/**/*.{js,jsx,ts,tsx}",
    "./src/elements/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  prefix: "ky-",
  theme: {
    extend: {},
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },
  plugins: [],
  darkMode: "class",
};
