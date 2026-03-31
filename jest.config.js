/** @type {import("jest").Config} */
const config = {
  testEnvironment: "node",
  roots: ["<rootDir>"],
  testMatch: ["**/*.test.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: { module: "commonjs", moduleResolution: "node" },
      },
    ],
  },
  setupFiles: ["<rootDir>/jest.setup.ts"],
};

module.exports = config;
