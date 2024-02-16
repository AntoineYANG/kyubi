/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
/*
 * @Author: Kyusho 
 * @Date: 2024-02-15 14:24:22 
 * @Last Modified by: Kyusho
 * @Last Modified time: 2024-02-16 14:15:05
 */

const colors = require('tailwindcss/colors');


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
    colors: {
      ...colors,
      primary: 'hsl(var(--color-primary) / <alpha-value>)',
      secondary: 'hsl(var(--color-secondary) / <alpha-value>)',
      info: 'hsl(var(--color-info) / <alpha-value>)',
      success: 'hsl(var(--color-success) / <alpha-value>)',
      warning: 'hsl(var(--color-warning) / <alpha-value>)',
      danger: 'hsl(var(--color-danger) / <alpha-value>)',
      outline: 'hsl(var(--color-outline) / <alpha-value>)',
    },
  },
  plugins: [],
  darkMode: "class",
};
