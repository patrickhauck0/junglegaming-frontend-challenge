import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#140D0A',
        surface: {
          card: '#241612',
          raised: '#2F1D15',
          dark: '#38220F',
        },
        border: {
          DEFAULT: '#3F2319',
          soft: '#55321F',
        },
        primary: {
          DEFAULT: '#D28A4C',
          hover: '#E08A3C',
          light: '#E89B55',
        },
        secondary: '#B39463',
        amber: {
          DEFAULT: '#E3A44E',
        },
        text: {
          primary: '#F7F3EC',
          secondary: '#CFB28C',
          accent: '#E89B55',
          coral: '#F0805F',
        },
        foreground: '#F5F1EB',
        success: '#00A66C',
      },
      fontFamily: {
        mono: ['"Roboto Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.8s infinite',
      },
    },
  },
  plugins: [],
};

export default config;
