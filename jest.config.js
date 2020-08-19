module.exports = {
  preset: 'jest-preset-angular',
  setupFiles: ['<rootDir>/setup-jest.ts'],
  setupFilesAfterEnv: ['<rootDir>/setup-jest-env.ts'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/src/',
  ],
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
      tsConfig: '<rootDir>/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.html$'
    }
  }
};
