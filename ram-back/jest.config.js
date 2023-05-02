"use strict";
// (c) Delta Software 2023, rights reserved.
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    rootDir: "./src",
    setupFiles: ["<rootDir>/__tests__/setup.ts"],
    transform: {
        "^.+\\.ts$": "ts-jest",
    },
    testRegex: "/__tests__/.*(test|spec)\\.ts$",
};
exports.default = config;
