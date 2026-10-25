/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"Plus Jakarta Sans"', 'ui-monospace', 'monospace'],
      },
      colors: {
        aicte: {
          navy: '#0c2340',
          'navy-dark': '#071526',
          'navy-light': '#163a66',
          rose: '#881337',
          'rose-dark': '#4c0519',
          'rose-deep': '#9f1239',
          saffron: '#ea580c',
          'saffron-light': '#f97316',
          'saffron-soft': '#fff7ed',
          gold: '#f59e0b',
          emerald: '#059669',
          crimson: '#e11d48',
          surface: '#f1f5f9',
          border: '#e2e8f0',
        },
      },
      backgroundImage: {
        'sovereign-matrix': 'linear-gradient(to right, #881337, #9f1239, #0c2340)',
      },
      boxShadow: {
        gov: '0 1px 3px 0 rgba(15, 23, 42, 0.08), 0 1px 2px -1px rgba(15, 23, 42, 0.08)',
        'gov-card': '0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.07)',
        'gov-lg': '0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
};
