/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f1ff',
          100: '#cce3ff',
          200: '#99c7ff',
          300: '#66aaff',
          400: '#338eff',
          500: '#0073e6',
          600: '#005bb8',
          700: '#00448a',
          800: '#002d5c',
          900: '#00162e',
        },
        secondary: {
          50: '#e6fbfc',
          100: '#ccf7f9',
          200: '#99eff3',
          300: '#66e7ed',
          400: '#33dfe7',
          500: '#00b8c4',
          600: '#00939d',
          700: '#006e76',
          800: '#00494e',
          900: '#002427',
        },
        accent: {
          50: '#fbecee',
          100: '#f7d9dd',
          200: '#efb3bb',
          300: '#e78d99',
          400: '#df6777',
          500: '#dc3545',
          600: '#b02a37',
          700: '#842029',
          800: '#58151c',
          900: '#2c0b0e',
        },
        success: {
          500: '#198754',
        },
        warning: {
          500: '#ffc107',
        },
        error: {
          500: '#dc3545',
        },
        gray: {
          50: '#f8f9fa',
          100: '#e9ecef',
          200: '#dee2e6',
          300: '#ced4da',
          400: '#adb5bd',
          500: '#6c757d',
          600: '#495057',
          700: '#343a40',
          800: '#212529',
          900: '#0a0a0a',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        heading: ['"Montserrat"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};