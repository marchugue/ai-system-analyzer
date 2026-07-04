/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FAFAF8',
        ink: '#14161A',
        line: '#E4E1D8',
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#161A22',
        },
        base: {
          DEFAULT: '#FAFAF8',
          dark: '#0D0F14',
        },
        text: {
          DEFAULT: '#14161A',
          soft: '#5C5F66',
          dark: '#EDEEF0',
          'dark-soft': '#9AA0AC',
        },
        signal: {
          DEFAULT: '#2947E5',
          soft: '#EEF1FD',
          dark: '#5B7CFF',
        },
        flag: {
          DEFAULT: '#C9832E',
          soft: '#FBF1E1',
          dark: '#E3A75B',
        },
        ledger: {
          DEFAULT: '#3D7A5C',
          soft: '#E9F3EE',
          dark: '#5FAE87',
        },
        alert: {
          DEFAULT: '#B5432E',
          soft: '#FBEAE6',
          dark: '#E3735B',
        },
        linedark: '#242832',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(20,22,26,0.04), 0 8px 24px -8px rgba(20,22,26,0.08)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        stamp: {
          '0%': { opacity: 0, transform: 'scale(1.3) rotate(-8deg)' },
          '60%': { opacity: 1, transform: 'scale(0.96) rotate(-2deg)' },
          '100%': { opacity: 1, transform: 'scale(1) rotate(-2deg)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.5s ease-out both',
        stamp: 'stamp 0.4s cubic-bezier(0.2,0.8,0.2,1) both',
      },
    },
  },
  plugins: [],
};
