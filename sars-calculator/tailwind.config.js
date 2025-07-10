/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f8fafc',
          500: '#0f172a',
          600: '#0f172a',
          700: '#020617',
          900: '#0f172a',
        },
        secondary: {
          50: '#ecfdf5',
          500: '#059669',
          600: '#059669',
          700: '#047857',
        },
        accent: {
          50: '#fef2f2',
          500: '#dc2626',
          600: '#dc2626',
          700: '#b91c1c',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
} 