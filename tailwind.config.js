/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./{components,pages,src}/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#0891b2', // cyan-600
          hover: '#06b6d4', // cyan-500
          dark: '#0e7490'  // cyan-700
        },
        secondary: '#475569', // slate-600
        light: '#f1f5f9', // slate-100
        dark: '#1e293b' // slate-800
      }
    }
  },
  plugins: [],
}