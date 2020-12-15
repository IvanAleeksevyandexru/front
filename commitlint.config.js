module.exports = {
  rules: {
    'header-min-length': [2, 'always', 20],
  },
  parserPreset: {
    parserOpts: {
      headerPattern: /^(feat|fix|refactor|docs|ci|style|chore|test|BREAKING CHANGE):.*\[EPGUCORE-(\d{5,}|N\\A)\] \S+ \S+ \S+ \S+ \S+/,
      headerCorrespondence: ['type', 'scope', 'subject']
    }
  }
};
