require('jest-preset-angular/ngcc-jest-processor');
const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { paths } = require('./tsconfig.json').compilerOptions;

module.exports = {
  preset: 'jest-preset-angular/presets/defaults-esm',
  modulePaths: ['<rootDir>'],
  moduleDirectories: ['node_modules'],
  setupFiles: ['<rootDir>/configs/jest/setup-jest.ts', 'jest-canvas-mock'],
  setupFilesAfterEnv: ['<rootDir>/configs/jest/setup-jest-env.ts'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/', '<rootDir>/src/', '<rootDir>/projects/sf-portal'],
  moduleNameMapper: {
    '@ifc/plugin': '<rootDir>/node_modules/@epgu/ui/assets/vendor/ifcplugin-lib.js',
    '@ifc/common': '<rootDir>/node_modules/@epgu/ui/assets/vendor/ifccommon-lib.js',
    '@epgu/epgu-constructor-ui-kit': '<rootDir>/projects/epgu-constructor-ui-kit/src/public-api',
    ...pathsToModuleNameMapper(paths, { prefix: '<rootDir>' }),
  },
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  // cacheDirectory: '<rootDir>/.jest-cache',
  coverageReporters: ['text', 'cobertura', 'html'],
  collectCoverageFrom: [
    'projects/**/*.service.ts',
    'projects/**/*.component.ts',
    'projects/**/*.directive.ts',
    'projects/**/*.interceptor.ts',
    'projects/**/*.pipe.ts',
    'projects/**/*.strategy.ts',
    'projects/**/*.validators.ts',
    'projects/**/*.guard.ts',
  ],
  testEnvironment: 'jsdom',
  transform: {
    '\\.svg': '<rootDir>/asset-transformer.js',
    '^.+\\.(ts|js|mjs|html)$': 'jest-preset-angular',
  },
  moduleFileExtensions: ['ts', 'html', 'js', 'json', 'svg', 'mjs'],
  resolver: 'jest-preset-angular/build/resolvers/ng-jest-resolver.js',
  extensionsToTreatAsEsm: ['.ts'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      isolatedModules: false,
      stringifyContentPathRegex: '\\.(html|svg)$',
      useESM: true
    },
  },
  testEnvironmentOptions: {
    beforeParse(window) {
      window.scroll = () => { };
    },
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!.*\\.mjs$|date-fns|tslib|@epgu/ui/node_modules/date-fns)'],
};
