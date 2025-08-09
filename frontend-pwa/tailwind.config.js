/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#C12B2B',
          dark: '#9E1F1F',
          light: '#E05050',
        },
        bg: '#0B0B0B',
        surface: '#141414',
        text: {
          primary: '#FFFFFF',
          secondary: '#CFCFCF',
        },
      },
      fontFamily: {
        sans: ['Almarai', 'Segoe UI', 'Tahoma', 'Arial', 'Helvetica', 'sans-serif'],
      },
    },
  },
  plugins: [],
  future: {
    hoverOnlyWhenSupported: true,
  },
}
