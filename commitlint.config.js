module.exports = {
  extends: ['@commitlint/config-conventional'],
  plugins: ['commitlint-plugin-function-rules'],
  rules: {
    'function-rules/header-max-length': [
      2, // level: error
      'always',
      (parsed) => {
        console.log(parsed)
        if (/\[EPGUCORE-\d{5,}\]+$/.test(parsed.subject)) {
          return [true];
        }
        return [false, 'subject should contain Jira issue reference on the end, like [EPGUCORE-11111]'];
      },
    ],
  },
};
