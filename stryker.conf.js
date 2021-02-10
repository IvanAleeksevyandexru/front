/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */
module.exports = {
  packageManager: 'npm',
  reporters: ['html', 'clear-text', 'progress'],
  mutate: [
    'projects/epgu-constructor/src/app/**/*.ts',
    '!projects/epgu-constructor/src/app/**/*.spec.ts',
    '!projects/epgu-constructor/src/app/**/data.ts',
  ],
  testRunner: 'jest',
  jest: {
    projectType: 'custom',
    configFile: 'jest.config.js',
  },
};
