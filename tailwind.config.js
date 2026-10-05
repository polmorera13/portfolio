/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#0D1B2A',
        // deep: fondo de botones y bandas con texto blanco (contraste 4,5:1)
        'brand-blue': { DEFAULT: '#4A90D9', deep: '#2D6FB8' },
        'steel-blue': '#8AAFCC',
        'off-white': '#F4F6F9',
        charcoal: '#2C3E50',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      fontSize: {
        'display': 'clamp(40px, 6vw, 88px)',
        'section': 'clamp(32px, 4vw, 64px)',
        'card-heading': 'clamp(20px, 2vw, 28px)',
      },
      letterSpacing: {
        eyebrow: '0.25em',
      },
      maxWidth: {
        content: '1280px',
      },
    },
  },
  plugins: [],
};
