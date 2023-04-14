// (c) Delta Software 2023, rights reserved.

import type { Config } from "jest";

const config: Config = {
  setupFiles: ["./jest.setup.ts"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^.+\\.svg$": "jest-svg-transformer",
    "\\.(css|less|scss)$": "identity-obj-proxy",
  },
  transform: {
    "^.+\\.tsx?$": "babel-jest",
  },
};

export default config;
