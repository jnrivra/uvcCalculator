/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'uvc-purple': '#8B5CF6',
        'uvc-blue': '#3B82F6',
        'uvc-dark': '#1E293B',
      }
    },
  },
  plugins: [],
}