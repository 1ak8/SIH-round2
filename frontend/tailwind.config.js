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
          surface: '#f8fafc',
          border: '#e2e8f0',
        },
      },
      backgroundImage: {
        'sovereign-matrix': 'linear-gradient(135deg, #881337 0%, #9f1239 50%, #0c2340 100%)',
      },
      boxShadow: {
        '2xs': '0 1px 2px 0 rgba(15, 23, 42, 0.04)',
        xs: '0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.04)',
        saas: '0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.02)',
        'saas-hover': '0 8px 24px -4px rgba(15, 23, 42, 0.06), 0 2px 6px -2px rgba(15, 23, 42, 0.03)',
        'saas-lg': '0 16px 36px -8px rgba(15, 23, 42, 0.08), 0 4px 12px -2px rgba(15, 23, 42, 0.03)',
      },
    },
  },
  plugins: [],
};
