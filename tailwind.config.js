/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        pry:"#105679",
        sec:"#e5f7ff",
        ter:"#F3F4F6",
        grey:"#737373",
      },
      container:{
        center: true,
        padding: "1rem",
        screens: {
          "2xl": "1400px",
          xl: "1200px",
          lg: "1000px",
          md: "800px",
          sm: "600px",
        },
      }
    },
  },
  plugins: [],
}