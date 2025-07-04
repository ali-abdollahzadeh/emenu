/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a1a1a',
        secondary: '#333333',
        accent: '#ff6b6b',
      },
      fontFamily: {
        sans: ['Yekan Bakh', 'sans-serif'],
        yekan: ['Yekan Bakh', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 