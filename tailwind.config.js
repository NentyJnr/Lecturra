/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lectura: {
          navy: {
            50: '#F0F4FF',
            100: '#E0E7FF',
            700: '#2E1065',
            800: '#1E1B4B',
            900: '#0F172A',
          },
          blue: {
            50: '#EFF6FF',
            100: '#DBEAFE',
            500: '#3B82F6',
            600: '#2563EB',
            700: '#1D4ED8',
            800: '#1E3A8A',
          },
          slate: {
            50: '#F8FAFC',
            100: '#F1F5F9',
            200: '#E2E8F0',
            300: '#CBD5E1',
            600: '#475569',
            700: '#334155',
            800: '#1E293B',
            900: '#0F172A',
          }
        }
      },
      fontSize: {
        'senior-base': ['1rem', { lineHeight: '1.6' }],
        'senior-lg': ['1.125rem', { lineHeight: '1.6' }],
        'senior-xl': ['1.35rem', { lineHeight: '1.5' }],
        'senior-2xl': ['1.75rem', { lineHeight: '1.4' }],
      },
      boxShadow: {
        'card-soft': '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
        'card-hover': '0 10px 30px -4px rgba(15, 23, 42, 0.1)',
      }
    },
  },
  plugins: [],
}
