const { off } = require("process");

module.exports = {
  extends: ['plugin:@angular-eslint/recommended'],
  rules: {
    // ORIGINAL tslint.json -> "directive-selector": [true, "attribute", "app", "camelCase"],
    '@angular-eslint/directive-selector': [
      'error',
      { type: 'attribute', prefix: 'app', style: 'camelCase' },
    ],
    // ORIGINAL tslint.json -> "component-selector": [true, "element", "app", "kebab-case"],
    '@angular-eslint/component-selector': [
      'error',
      { type: 'element', prefix: 'app', style: 'kebab-case' },
    ],
  },
  overrides: [
    // Add this rules, if you use inline templates inside *.component.ts files
    {
      files: ['*.component.ts'],
      extends: [
        // AirBnB Styleguide rules
        'airbnb-typescript/base',
        // Settings for Prettier
        'prettier/@typescript-eslint',
        'plugin:prettier/recommended',
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      // Custom rules
      rules: {
        'import/no-unresolved': 'off',
        // 'import/no-extraneous-dependencies': 'off',
        'import/prefer-default-export': 'off',
        'class-methods-use-this': 'off',
        "lines-between-class-members": "off",
        "@typescript-eslint/no-useless-constructor": ['off', 'always'],
        "@typescript-eslint/no-empty-function": ['off', 'always'],
        "@typescript-eslint/lines-between-class-members": ["off", "always", { "exceptAfterOverload": false }],
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
