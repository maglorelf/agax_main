/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        lichess: {
          dark: '#262421',
          light: '#edebe9',
          accent: '#3692e7'
        }
      }
    },
  },
  plugins: [],
}
