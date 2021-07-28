module.exports = {
  extends: [
    // AirBnB Styleguide rules
    'airbnb-typescript/base',
    // Settings for Prettier
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],

  overrides: [
    // Add this rules, if you use inline templates inside *.component.ts files
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.json',
      },
      // Custom rules
      rules: {
        'no-shadow': 'off',
        'import/no-unresolved': 'off',
        'import/prefer-default-export': 'off',
        'class-methods-use-this': 'off',
        "lines-between-class-members": "off",
        "max-len": ["error", { "code": 180, "ignoreStrings": true, ignorePattern: '^import .*' }],
        "@typescript-eslint/lines-between-class-members": ["off", "always", { "exceptAfterOverload": false }],
        '@typescript-eslint/array-type': ["error", { "default": "array-simple" }],
      },
    },
  ],
};
