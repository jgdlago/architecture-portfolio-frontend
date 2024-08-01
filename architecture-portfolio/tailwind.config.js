/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'selector',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        primaryText: 'var(--primary-text)',
        contrastGold: 'var(--contrast-gold)',
        contrastBrown: 'var(--contrast-brown)',
        accent: 'var(--accent)',
      },
    },
  },
  plugins: [],
}

