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
          blue: {
            50: "#e2e7ec",
            100: "#b6c3d0",
            200: "#859bb1",
            300: "#547392",
            400: "#2f557a",
            500: "#0a3763",
            600: "#09315b",
            700: "#072a51",
            800: "#052347",
            900: "#031635",
          },

          orange: {
            50: "#ffede5",
            100: "#fed3be",
            200: "#feb692",
            300: "#fd9866",
            400: "#fc8246",
            500: "#fc6c25",
            600: "#fc6421",
            700: "#fb591b",
            800: "#fb4f16",
            900: "#fa3d0d",
          },

          cream: "#e6dcd1",
          brown: "#7e4e3a",
          white: "#e9e9e9",

          "gray-black": "#878584",
          "gray-ligth": "#bcbcbc",

          "burly-wood": "#ba8c70",
          "navajo-white": "#d0a97e",
        },
      },
    },
  },
  plugins: [require("flowbite/plugin"), require("prettier-plugin-tailwindcss")],
};
