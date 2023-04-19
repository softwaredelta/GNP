// (c) Delta Software 2023, rights reserved.

import type { Config } from "jest";

const config: Config = {
  setupFiles: ["./jest.setup.ts"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^.+\\.svg$": "jest-svg-transformer",
    "\\.(css|less|scss)$": "identity-obj-proxy",
    "\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/src/__test__/file-mock.js",
  },
  transform: {
    "^.+\\.tsx?$": "babel-jest",
  },
};

export default config;
