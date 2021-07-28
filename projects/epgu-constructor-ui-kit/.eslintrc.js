module.exports = {
  extends: ['plugin:@angular-eslint/recommended'],
  rules: {
    '@angular-eslint/directive-selector': [
      'error',
      { type: 'attribute', prefix: 'epgu-cf-ui', style: 'kebab-case' },
    ],
    '@angular-eslint/component-selector': [
      'error',
      { type: 'element', prefix: 'epgu-cf-ui', style: 'kebab-case' },
    ],
    semi: 'off',
    '@typescript-eslint/semi': ['error'],
    'no-empty-function': ['error', { "allow": ["constructors"] }],
    'object-curly-spacing': ["error", "always", { "objectsInObjects": false }],
    '@typescript-eslint/no-explicit-any': ["error", { "ignoreRestArgs": false }],
    '@typescript-eslint/typedef': [
      "error",
      {
        "arrowParameter": false,
        "memberVariableDeclaration": false
      }
    ],
    "@typescript-eslint/explicit-function-return-type": ["error"],
    '@typescript-eslint/array-type': ["error", { "default": "array" }],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/member-ordering": ["error", {
      "default": [
        "signature",
        "public-static-field",
        "protected-static-field",
        "private-static-field",
        "public-decorated-field",
        "protected-decorated-field",
        "private-decorated-field",
        "public-instance-field",
        "protected-instance-field",
        "private-instance-field",
        "public-abstract-field",
        "protected-abstract-field",
        "private-abstract-field",
        "public-field",
        "protected-field",
        "private-field",
        "static-field",
        "instance-field",
        "abstract-field",
        "decorated-field",
        "field",
        "public-constructor",
        "protected-constructor",
        "private-constructor",
        "constructor",
        "public-static-method",
        "protected-static-method",
        "private-static-method",
        "public-decorated-method",
        "protected-decorated-method",
        "private-decorated-method",
        "public-instance-method",
        "protected-instance-method",
        "private-instance-method",
        "public-abstract-method",
        "protected-abstract-method",
        "private-abstract-method",
        "public-method",
        "protected-method",
        "private-method",
        "static-method",
        "instance-method",
        "abstract-method",
        "decorated-method",
        "method"
      ]
    }
    ]
  },
  overrides: [
    // Add this rules, if you use inline templates inside *.component.ts files
    {
      files: ['*.component.ts'],
      extends: [
        'airbnb-typescript/base',
        'prettier/@typescript-eslint',
        'plugin:prettier/recommended',
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      rules: {
        'no-underscore-dangle': 'off',
        'import/no-unresolved': 'off',
        'import/prefer-default-export': 'off',
        'class-methods-use-this': 'off',
        "lines-between-class-members": "off",
        "max-len": ["error", { "code": 180, ignorePattern: '^import .*' }],
        "no-shadow": "off",
        "@typescript-eslint/no-shadow": ["error"],
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
    },
    {
      files: ['*.spec.ts', '*.stub.ts', '*.types.ts', '*.const.ts', '*.mock.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/typedef': 'off',
        "@typescript-eslint/explicit-function-return-type": 'off',
        "@typescript-eslint/no-unused-vars": 'off',
        "@typescript-eslint/member-ordering": 'off',
        "max-len": ["error", { "code": 180, ignorePattern: '^import .*' }],
      }
    }
  ],
};
