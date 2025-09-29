/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{astro,js,ts,jsx,tsx}',
    './public/**/*.html',
  ],
  theme: {
    extend: {
      colors: {
        prime: {
          DEFAULT: '#FF4C1D', // Naranja del logo
          dark: '#000000',    // Fondo negro
          light: '#FFFFFF',   // Blanco para texto
        },
        orange: {
          400: '#FB923C',
          500: '#FF4C1D', // Color principal del logo
          600: '#E63E00',
          700: '#CC3500',
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
