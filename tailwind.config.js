/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      mobile: { max: '599px' },
      tablet: { min: '600px', max: '1024px' },
      laptop: { min: '1025px' },
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        primary: '#2563eb',
      },
    },
  },
  plugins: [],
};
