// (c) Delta Software 2023, rights reserved.

import type { Config } from "jest";

const config: Config = {
  rootDir: "./src",
  setupFiles: ["<rootDir>/__tests__/setup.ts"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  testRegex: "/__tests__/.*(test|spec)\\.ts$",
};

export default config;
