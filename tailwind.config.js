/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './contexts/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        stable: {
          900: '#0a1a0f',
          800: '#112214',
          700: '#1a3320',
          600: '#224428',
          500: '#2d5c35',
          400: '#3d7a47',
          300: '#5a9e65',
          200: '#8ec995',
          100: '#c4e8c8',
          50:  '#edf7ee',
        },
        gold: {
          900: '#3d2800',
          700: '#7a5200',
          500: '#c9a84c',
          400: '#d4b86a',
          300: '#e0cc96',
          100: '#f5ecd0',
          50:  '#fdf8ee',
        },
        sand: {
          900: '#2c2416',
          700: '#5c4a2a',
          500: '#9c7d4a',
          300: '#c9aa78',
          100: '#ede0c8',
          50:  '#faf5ec',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Georgia', 'serif'],
      },
      minHeight: {
        touch: '52px',
      },
      fontSize: {
        'touch': ['16px', '24px'],
      },
    },
  },
  plugins: [],
}
