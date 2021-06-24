/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */
module.exports = {
  packageManager: 'npm',
  reporters: ['html', 'clear-text', 'progress'],
  mutate: [
    'projects/epgu-constructor/src/lib/**/*.ts',
    '!projects/epgu-constructor/src/lib/**/*.spec.ts',
    '!projects/epgu-constructor/src/lib/**/data.ts',
  ],
  testRunner: 'jest',
  jest: {
    projectType: 'custom',
    configFile: 'jest.config.js',
  },
};
