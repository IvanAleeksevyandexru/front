module.exports = {
  preset: 'jest-preset-angular',
  modulePaths: ['<rootDir>'],
  moduleDirectories: ['node_modules'],
  setupFiles: ['<rootDir>/setup-jest.ts', 'jest-canvas-mock'],
  setupFilesAfterEnv: ['<rootDir>/setup-jest-env.ts'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/', '<rootDir>/src/'],
  moduleNameMapper: {
    '@ifc/plugin': '<rootDir>/node_modules/@epgu/ui/assets/vendor/ifcplugin-lib.js',
    '@ifc/common': '<rootDir>/node_modules/@epgu/ui/assets/vendor/ifccommon-lib.js',
    '@epgu/epgu-constructor-ui-kit': '<rootDir>/projects/epgu-constructor-ui-kit/src/public-api',
    '@epgu/epgu-constructor-types': '<rootDir>/projects/epgu-constructor-types/src',
  },
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
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
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      isolatedModules: true,
      stringifyContentPathRegex: '\\.html$',
      astTransformers: {
        before: [
          'jest-preset-angular/build/InlineFilesTransformer',
          'jest-preset-angular/build/StripStylesTransformer',
        ],
      },
    },
  },
  testEnvironmentOptions: {
    beforeParse(window) {
      window.scroll = () => {};
    },
  },
};
