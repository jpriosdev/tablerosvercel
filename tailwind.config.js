/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

module.exports = {
    content: [
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
      './styles/**/*.{css}',
      './styles/globals.css',
    ],
    theme: {
      extend: {
        // ensure the default gray palette is available (prevents unknown utility errors)
        colors: {
          gray: colors.gray,
          'executive': {
            50: '#f0f9ff',
            500: '#0ea5e9',
            600: '#0284c7',
            700: '#0369a1',
            900: '#0c4a6e',
          },
          'success': {
            50: '#f0fdf4',
            200: '#bbf7d0',
            500: '#22c55e',
            600: '#16a34a',
          },
          'warning': {
            50: '#fffbeb',
            200: '#fed7aa',
            500: '#f59e0b',
            600: '#d97706',
          },
          'danger': {
            50: '#fef2f2',
            200: '#fecaca',
            500: '#ef4444',
            600: '#dc2626',
          }
        },
        fontFamily: {
          'executive': ['Inter', 'system-ui', 'sans-serif'],
        },
        animation: {
          'fade-in': 'fadeIn 0.5s ease-in-out',
          'slide-up': 'slideUp 0.3s ease-out',
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
          }
        }
      },
    },
    plugins: [],
  }

  