/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./App.tsx",
    "./main.tsx"
  ],
  theme: {
    extend: {
      colors: {
        // Aduffy brand colors
        'aduffy-teal': '#1db5a3',
        'aduffy-yellow': '#ffb84c',
        'aduffy-orange': '#ff9f3e',
        'aduffy-navy': '#2d3748',
      },
      fontFamily: {
        'sarabun': ['Sarabun', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '1.5rem',
      },
      spacing: {
        '8': '2rem',
      },
      transitionDuration: {
        '500': '500ms',
      },
    },
  },
  plugins: [],
} 