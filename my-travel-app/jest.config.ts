// jest.config.ts
import type { Config } from "jest";
import nextJest from "next/jest.js";

// Tell next/jest where your Next.js app lives
const createJestConfig = nextJest({ dir: "./" });

// Custom Jest settings
const config: Config = {
  // Use V8 for coverage (faster, smaller reports)
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  // This will load your setup file before each test file
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};

export default createJestConfig(config);
