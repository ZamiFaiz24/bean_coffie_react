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
        coffee: {
          50: '#FDFBF7',   // Lightest
          100: '#F5E6D3',  // Very light
          200: '#ECDCC8',  // Light
          300: '#E8D4C4',  // Soft
          400: '#D4A574',  // Warm amber
          500: '#C9935C',  // Medium
          600: '#A0826D',  // Brown
          700: '#8B6F47',  // Deep brown
          800: '#6B5635',  // Dark brown
          900: '#4A3A24',  // Very dark
        },
        accent: {
          light: '#D4A574',
          DEFAULT: '#C9935C',
          dark: '#A0826D',
        },
      },
      backgroundImage: {
        'coffee-gradient': 'linear-gradient(135deg, #A0826D 0%, #8B6F47 100%)',
        'coffee-warm': 'linear-gradient(135deg, #F5E6D3 0%, #E8D4C4 100%)',
      },
    },
  },
  plugins: [],
}
export default config