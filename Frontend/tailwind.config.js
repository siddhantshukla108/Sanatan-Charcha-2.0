/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Special fonts for Indian languages and spiritual feel
        sans: ['"Noto Sans"', 'sans-serif'],
        serif: ['"Merriweather"', 'serif'], // For Titles / Shlokas
      },
      colors: {
        saffron: {
          50: '#fff8f3',
          100: '#fff0e6',
          200: '#ffd9b8',
          300: '#ffc58d',
          400: '#ffb066',
          500: '#ff8f2b', // Primary
          600: '#f26f20',
          700: '#c45318', // Darker Saffron
          800: '#9a3d11',
          900: '#6f2709'
        },
        maroon: {
          50: '#fdf2f2',
          100: '#fce4e4',
          200: '#f9cccc',
          300: '#f3a3a3',
          400: '#b53434',
          500: '#8B2D2D', // Deep Red/Maroon for accents
          600: '#7a2626',
          700: '#5D2E2E', // Text color alternative to black
          800: '#4a2020',
          900: '#3b1515', // Darkest maroon (used in hero sections)
        },
        sand: {
          50: '#FFFBF2', // Warm paper background
          100: '#FDF6E3',
          200: '#f9edcc',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}