import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testRunner: 'jest-circus/runner',
  testEnvironment: './jest-environment-fail-fast.ts',
};

export default config;
