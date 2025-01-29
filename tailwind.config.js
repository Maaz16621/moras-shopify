/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  
  theme: {
    extend: {
      height: {
        '102': '30rem', // Example height, adjust as needed
      },
      animation: {
        fadeIn: "fadeIn 1s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
      screens: {
        '2xl': '1536px', // Default Tailwind 2xl
        '3xl': '1800px', // Custom large screen
        '4xl': '2200px', // Extra large screen
      },
    },
  },
  plugins: [],
}
