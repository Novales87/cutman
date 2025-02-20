/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        'pulse-grow': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
        },
        'fade-in-out': { // Simplified fade-in-out animation
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.2' },
        },
        'color-transition': {
          '0%, 100%': { background: '#1f2937' }, // Tailwind gray-800 (original)
          '50%': { background: '#007bff' }, // Blue color
        },
      },
      animation: {
        'pulse-grow': 'pulse-grow 1.5s ease-in-out infinite', // Existing pulse-grow animation
        'fade-in-out': 'fade-in-out 1.5s ease-in-out infinite', // Simplified animation
        'color-transition': 'color-transition 6s ease-in-out infinite', // Increased duration to 6s for subtle transition
      },
    },
  },
  plugins: [],
};
