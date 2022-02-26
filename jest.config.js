const { defaults: jestConfig } = require('jest-config');

module.exports = {
  ...jestConfig,
  testEnvironment: 'node',
  rootDir: '.',
  roots: ['<rootDir>/src'],
  globals: {
    'ts-jest': {
      diagnostics: true,
      isolatedModules: true,
      tsconfig: './tsconfig.test.json',
    },
  },
  transform: {
    '.ts$': 'ts-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  modulePaths: ['<rootDir>'],
  modulePathIgnorePatterns: ['.serverless', 'node_modules', 'coverage', 'dist', 'jest.setup.js'],
  verbose: true,
};
