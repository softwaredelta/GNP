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
        GNP_Azul_Light: "#579dc3",
        GNP_Azul: "#012e71",
        GNP_Azul_Darker: "#012356",

        GNP_Naranja_Light: "#be7743",
        GNP_Naranja: "#fb6f24",
        GNP__Naranja_Darker: "#e15104",

        GNP_Crema: "#e6dcd1",
        GNP_Cafe: "#7e4e3a",
        GNP_Gris_Dark: "#878584",
        GNP_Gris_Light: "#bcbcbc",

        GNP_BurlyWood: "#ba8c70",
        GNP_NavajoWhite: "#d0a97e",
        GNP_White: "#e9e9e9",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
