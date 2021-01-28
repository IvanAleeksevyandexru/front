module.exports = {
  '*.{ts}': [
    'eslint --fix'
  ],
  '*.scss': [
    'stylelint \'**/*.scss\' --config .stylelintrc.json --fix'
  ]
}
