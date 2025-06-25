/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        lightestBlue: "#e0fbfc",
        lightBlue: "#c2dfe3",
        mediumBlue: "#9db4c0",
        darkBlue: "#5c6b73",
        darkestBlue: "#253237",
      },
    },
  },
  plugins: [],
};
