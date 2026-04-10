/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        ecvl: {
          green: {
            50:  '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#22c55e',
            600: '#16a34a',
            700: '#15803d',
            800: '#166534',
            900: '#14532d',
          },
          earth: {
            50:  '#fdf8f0',
            100: '#faefd9',
            200: '#f3d9a8',
            300: '#e9ba6d',
            400: '#dc9a38',
            500: '#c97f1f',
            600: '#a96319',
            700: '#874d18',
            800: '#6d3d19',
            900: '#5a341a',
          },
          cream: '#fef9f0',
          sky: '#e8f5e9',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
