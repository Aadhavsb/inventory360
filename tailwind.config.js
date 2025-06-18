/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        wildlife: {
          black: '#000000',
          green: '#6A8F3F',
          'green-dark': '#5A7A35',
          'green-light': '#7A9F55',
          ivory: '#F8F8F5',
          brown: '#8B4513',
          beige: '#F5F5DC',
          tan: '#D2B48C',
        }
      },
      fontFamily: {
        'wildlife': ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'wildlife': '0 4px 6px -1px rgba(106, 143, 63, 0.1), 0 2px 4px -1px rgba(106, 143, 63, 0.06)',
      }
    },
  },
  plugins: [],
};
