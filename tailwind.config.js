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
          DEFAULT: '#6B352A',
        },
        secondary: {
          DEFAULT: '#FFF1A6',
        },
        neutral: {
          primary: '#1F1F1F',
          secondary: '#6B7280',
          bg: '#FFFFFF',
          'bg-secondary': '#FAFAFA',
          border: '#E5E7EB',
          divider: '#F3F4F6',
        },
        feedback: {
          success: '#22C55E',
          warning: '#F59E0B',
          error: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
