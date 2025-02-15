const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: '#2977FF',
        secondary: colors.blue[300],
        darkSecondary: colors.blue[700],
        danger: colors.red[400],
        dangerDark: colors.red[700],
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};
