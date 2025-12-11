/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#A7C7E7",
        "secondary": "#8B4513",
        "background-light": "#FDF5E6",
        "background-dark": "#101c22",
        "text-color": "#333333"
      },
      fontFamily: {
        "display": ["Work Sans"]
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
    },
  },
  plugins: [],
}

