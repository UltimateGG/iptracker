/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', 'node_modules/flowbite-react/lib/esm/**/*.js'],
  theme: {
    extend: {
      colors: {
        // Flowbite uses cyan color for primary - bug rn
        cyan: {
          50: '#D1FFF0',
          100: '#8AFFDA',
          200: '#00F0A4',
          300: '#00CC8B',
          400: '#00A370',
          500: '#006747',
          DEFAULT: '#006747', // Commerce theme color
          600: '#005C3F',
          700: '#005238',
          800: '#00422D',
          900: '#002E1F',
          950: '#001F15'
        }
      },
      screens: {
        xs: '430px'
      },
      boxShadow: {
        wide: '0 6px 12px rgba(0, 0, 0, 0.04)'
      }
    }
  },
  plugins: [require('flowbite/plugin'), require('flowbite-typography')]
};
