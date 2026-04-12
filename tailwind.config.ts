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
        charcoal: {
          50: '#F9FAFB',
          100: '#F3F4F6',  // Light gray text
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',  // Main charcoal
          900: '#111827',  // Almost black
        },
        gold: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',  // Primary gold
          600: '#D97706',  // Deep gold
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
      },
      backgroundImage: {
        'coffee-gradient': 'linear-gradient(135deg, #A0826D 0%, #8B6F47 100%)',
        'coffee-warm': 'linear-gradient(135deg, #F5E6D3 0%, #E8D4C4 100%)',
        'charcoal-gradient': 'linear-gradient(135deg, #1F2937 0%, #111827 100%)',
        'gold-gradient': 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      },
    },
  },
  plugins: [],
}
export default config