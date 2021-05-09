module.exports = {
  extends: ['@commitlint/config-conventional'],
  plugins: ['commitlint-plugin-function-rules'],
  rules: {
    'function-rules/subject-case': [
      2, // level: error
      'always',
      (parsed) => {
        if (parsed.type === 'chore' && parsed.scope === 'release') {
          return [true];
        }
        if (/\[EPGUCORE-\d{5,}\]+$/.test(parsed.subject)) {
          return [true];
        }
        return [false, 'subject should contain Jira issue reference on the end, like [EPGUCORE-11111]'];
      },
    ],
  },
};
