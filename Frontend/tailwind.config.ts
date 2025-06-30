// tailwind.config.ts
import { type Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class', // enable dark mode toggling with a class
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // adjust based on your project structure
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

export default config
