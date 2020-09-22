module.exports = {
  extends: ['plugin:@angular-eslint/recommended'],
  rules: {
    '@angular-eslint/directive-selector': [
      'error',
      { type: 'attribute', prefix: 'epgu-constructor', style: 'kebab-case' },
    ],
    '@angular-eslint/component-selector': [
      'error',
      { type: 'element', prefix: 'epgu-constructor', style: 'kebab-case' },
    ],
    semi: 'off',
    '@typescript-eslint/semi': ['error'],
    'no-empty-function': ['error', { "allow": ["constructors"] }],
    'object-curly-spacing': ["error", "always", {"objectsInObjects": false}],
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
        'import/prefer-default-export': 'off',
        'class-methods-use-this': 'off',
        "lines-between-class-members": "off",
        "max-len": ["error", { "code": 180, "ignoreStrings": true }],
        "@typescript-eslint/lines-between-class-members": ["off", "always", { "exceptAfterOverload": false }],
        '@typescript-eslint/unbound-method': [
          'error',
          {
            ignoreStatic: true,
          },
        ],
      },
    },
    {
      files: ['*.stub.ts'],
      rules: {
        'no-empty-function': "off"
      }
    }
  ],
};
