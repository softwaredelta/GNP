/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/*.{js,jsx,ts,tsx}",
    "./node_modules/flowbite/**/*.js",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        gnp: {
          cream: "#e6dcd1",
          brown: "#7e4e3a",
          white: "#e9e9e9",
          "light-blue": "#579dc3",
          "primary-blue": "#012e71",
          "darker-blue": "#012356",
          "light-orange": "#be7743",
          "primary-orange": "#fb6f24",
          "darker-orange": "#e15104",
          "gray-black": "#878584",
          "gray-ligth": "#bcbcbc",
          "burly-wood": "#ba8c70",
          "navajo-white": "#d0a97e",
        },
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
