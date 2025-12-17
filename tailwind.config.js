/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        headlines: ['var(--font-headlines)'],
        cafe: ['var(--font-cafe)'],
        roboto: ['Roboto', 'sans-serif'],
      },
      fontSize: {
        'gob-title': ['16px', { lineHeight: '22px', letterSpacing: '0.22px' }],
        'gob-text': ['14px', { lineHeight: '20px', letterSpacing: '0px' }],
      },
    },
  },
  plugins: [],
};
