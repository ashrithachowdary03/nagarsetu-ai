/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
        },
        civic: {
          navy: '#0f172a',
          indigo: '#1e293b',
          blue: '#2563eb',
          teal: '#0d9488',
        }
      }
    },
  },
  plugins: [],
}
