/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    'node_modules/flowbite-react/lib/esm/**/*.js'
  ],
  theme: {
    fontSize: {
      /* Typography Scale */
      /* Generated using minor third - 1.200 */
      sm: ['0.833rem', { lineHeight: '1rem', fontWeight: '300' }],
      base: ['1rem', { lineHeight: '1.5rem', fontWeight: '400' }],
      xl: ['1.44rem', { lineHeight: '1.8rem', fontWeight: '500' }],
      '2xl': ['1.728rem', { lineHeight: '2.16rem', fontWeight: '500' }],
      '3xl': ['2.074rem', { lineHeight: '2.59rem', fontWeight: '500' }],
      '4xl': ['2.488rem', { lineHeight: '3.11rem', fontWeight: '500' }],
      '5xl': ['2.986rem', { lineHeight: '3.73rem', fontWeight: '600' }],
    },
    extend: {},
  },
  plugins: [
    require('flowbite/plugin')
  ],
};
