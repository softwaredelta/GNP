// (c) Delta Software 2023, rights reserved.

module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    "@babel/preset-typescript",
  ],
  plugins: [
    [
      "@babel/plugin-proposal-decorators",
      {
        decoratorsBeforeExport: true,
      },
    ],
    "@babel/plugin-proposal-class-properties",
  ],
};
