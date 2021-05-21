module.exports = {
  preset: 'jest-preset-angular',
  modulePaths: [
    '<rootDir>'
  ],
  moduleDirectories: [
    'node_modules'
  ],
  setupFiles: ['<rootDir>/setup-jest.ts', 'jest-canvas-mock'],
  setupFilesAfterEnv: ['<rootDir>/setup-jest-env.ts'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/src/',
  ],
  moduleNameMapper: {
    '@ifc/plugin': '<rootDir>/node_modules/@epgu/epgu-lib/assets/vendor/ifcplugin-lib.js',
    '@ifc/common': '<rootDir>/node_modules/@epgu/epgu-lib/assets/vendor/ifccommon-lib.js'
  },
  coverageReporters: ['text', 'cobertura', 'html'],
  collectCoverageFrom: [
    'projects/epgu-constructor/src/app/**/*.service.ts',
    'projects/epgu-constructor/src/app/**/*.component.ts',
    'projects/epgu-constructor/src/app/**/*.directive.ts',
    'projects/epgu-constructor/src/app/**/*.interceptor.ts',
    'projects/epgu-constructor/src/app/**/*.pipe.ts',
    'projects/epgu-constructor/src/app/**/*.strategy.ts',
    'projects/epgu-constructor/src/app/**/*.validators.ts',
    'projects/epgu-constructor/src/app/**/*.guard.ts'
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
    }
  },
  testEnvironmentOptions: {
    beforeParse(window) {
      window.scroll = () => { };
    }
  },
};
