/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */
module.exports = {
  packageManager: 'npm',
  reporters: ['html', 'clear-text', 'progress'],
  mutate: ['src/**/*.ts', '!src/**/*.spec.ts'],
  testRunner: 'jest',
  jest: {
    projectType: 'custom',
    configFile: 'jest.config.js',
  },
  checkers: ['typescript'],
  tsconfigFile: 'tsconfig.app.json',
  coverageAnalysis: 'perTest',
};
