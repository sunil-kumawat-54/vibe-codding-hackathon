/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#ea580c', // Warm vibrant restaurant orange
          'orange-light': '#f97316',
          'orange-dark': '#c2410c',
          charcoal: '#121212', // Deep luxury slate/dark surface
          'charcoal-light': '#1e1e1e',
          'charcoal-dark': '#0c0c0c',
          card: '#1c1c1e',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
