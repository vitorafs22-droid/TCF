/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        steam: {
          dark: '#171a21',
          card: '#1b2838',
          header: '#171a21',
          accent: '#66c0f4',
          blue: '#1b2838',
          hover: '#2a475e',
          text: '#c6d4df',
          btn: '#47a2ff'
        }
      }
    },
  },
  plugins: [],
}