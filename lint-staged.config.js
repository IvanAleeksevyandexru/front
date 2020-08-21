module.exports = {
  '*.{js,ts}': [
    'eslint --fix'
  ],
  '*.scss': [
    'stylelint \'**/*.scss\' --config .stylelintrc.json --fix'
  ]
}
