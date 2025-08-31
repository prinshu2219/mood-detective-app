/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        skybrand: { DEFAULT: '#60a5fa', 50: '#eff6ff', 100: '#dbeafe' },
        banana: { DEFAULT: '#fde68a', 100: '#fef3c7' },
        coral: { DEFAULT: '#fb7185', 100: '#fecdd3' },
      },
      fontFamily: {
        heading: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
