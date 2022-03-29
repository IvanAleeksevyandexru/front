const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const packageFile = require('./package.json');

module.exports = (config, context) => {
  const projectPaths = context.index.split('/');

  return {
    ...config,
    plugins: [
      ...config.plugins,
      new CopyPlugin({
        patterns: [
          {
            from: path.posix.join(
              path
                .resolve(__dirname, `./projects/${projectPaths[1]}/src/assets/**`)
                .replace(/\\/g, '/'),
              '*.json'
            ),
            to: '[path][name].' + packageFile.dependencies['@epgu/ui'] + '[ext]',
          },
          {
            from: path.posix.join(
              path.resolve(__dirname, `./node_modules/@epgu/ui/assets/**`).replace(/\\/g, '/'),
              '*.json'
            ),
            to: 'lib-assets/i18n/[name].' + packageFile.dependencies['@epgu/ui'] + '[ext]',
          },
        ],
      }),
    ],
  };
};
