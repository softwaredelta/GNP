module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { esmodules: true } }],
    ["@babel/preset-react", { runtime: "automatic" }],
    "@babel/preset-typescript",
    [
      "babel-preset-vite",
      {
        env: true, // defaults to true
        glob: false, // defaults to true
      },
    ],
  ],
};
