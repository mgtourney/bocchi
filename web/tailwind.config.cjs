/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,ts,svelte}'],
  theme: {
    fontFamily: {
      sans: ['Work Sans', 'sans-serif'],
    },
    plugins: [],
    extend: {
      animation: {
        marquee: 'marquee 15s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
    }
  }
}
