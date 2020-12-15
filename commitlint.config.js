module.exports = {
  rules: {
    'header-min-length': [2, 'always', 20],
  },
  parserPreset: {
    parserOpts: {
      headerPattern: /^(feat|fix|perf|test|BREAKING CHANGE):.*\[REF-(\d{3,}|N\\A)\] \S+ \S+ \S+ \S+ \S+/,
      headerCorrespondence: ['type', 'scope', 'subject']
    }
  }
};
