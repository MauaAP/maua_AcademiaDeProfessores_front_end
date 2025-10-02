/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        'maua-blue': '#014587',
        'maua-green': '#69A120',
        'maua-green-hover': '#517e17',
        'maua-red': '#A12020',
        'maua-red-hover': '#7c1a1a',
        'maua-orange': '#DC9D3E',
        'maua-orange-hover': '#c58d38',
        'maua-light-blue': '#60ADF4',
        'maua-light-blue-hover': '#4e8bc5',
        'maua-gray': '#D9D9D9',
        'maua-dark-red': '#4F1313',
        'maua-dark-blue': '#14134F',
      },
      animation: {
        'spin': 'spin 1s linear infinite',
        'fadeIn': 'fadeIn 0.5s ease-in-out',
        'slideIn': 'slideIn 0.3s ease-out',
        'bounce': 'bounce 1s infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        }
      }
    },
  },
  plugins: [],
}

