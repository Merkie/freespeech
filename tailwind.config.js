/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Almarai', 'sans-serif']
      }
    }
  },
  plugins: [],
  safelist: ['bg-red-100', 'border-red-500', 'text-red-950', 'bg-orange-100', 'border-orange-500', 'text-orange-950', 'bg-yellow-100', 'border-yellow-500', 'text-yellow-950', 'bg-green-100', 'border-green-500', 'text-green-950', 'bg-blue-100', 'border-blue-500', 'text-blue-950', 'bg-purple-100', 'border-purple-500', 'text-purple-950', 'bg-pink-100', 'border-pink-500', 'text-pink-950']
};