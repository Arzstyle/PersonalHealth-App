/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'ai-bg': '#02050a',
        'ai-green': '#00ff88', // Green Neon
        'ai-green-light': '#80ffc2',
        'ai-accent': '#00ff41',
        'ai-secondary': '#0a101f',
        'ai-border': '#ffffff15',
      }
    },
  },
  plugins: [],
}
