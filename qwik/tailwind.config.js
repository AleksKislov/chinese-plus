/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("daisyui"),
    require("@tailwindcss/aspect-ratio"),
  ],
  daisyui: {
    styled: true,
    // themes: true,
    base: true,
    utils: true,
    rtl: false,
    prefix: "",
    // darkTheme: "night",
    themes: ["night", "emerald"],
  },
};
