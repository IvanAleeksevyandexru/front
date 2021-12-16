module.exports = {
  root: true,
  extends: ['plugin:@angular-eslint/recommended'],
  rules: {},
  overrides: [
    {
      files: ['*.component.ts'],
      extends: [
        'airbnb-typescript/base',
        'prettier/@typescript-eslint',
        'plugin:prettier/recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      rules: {
        'import/no-unresolved': 'off',
        'import/prefer-default-export': 'off',
        'class-methods-use-this': 'off',
        'lines-between-class-members': 'off',
        'max-len': ['error', { code: 180, ignoreStrings: true, ignorePattern: '^import .*' }],
        '@typescript-eslint/lines-between-class-members': [
          'off',
          'always',
          { exceptAfterOverload: false },
        ],
        '@typescript-eslint/unbound-method': [
          'error',
          {
            ignoreStatic: true,
          },
        ],
      },
    },
  ],
};
