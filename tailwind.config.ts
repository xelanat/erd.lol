import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'retro-blue': '#0a2463',
        'retro-pink': '#fb3640',
        'retro-yellow': '#ffc857',
        'retro-green': '#3f88c5',
      },
      fontFamily: {
        'retro': ['Helvetica', "Arial"],
      },
    },
  },
  plugins: [],
}
export default config
