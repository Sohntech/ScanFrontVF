/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'orange-primary': '#FF7900',
        'orange-dark': '#F16E00',
        'orange-light': '#FFB400',
        'black-primary': '#000000',
        'gray-primary': '#595959',
      },
    },
  },
  plugins: [],
}