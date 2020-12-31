module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],
  webpackFinal: async (config) => {
    const scssLoaders = config.module.rules.find(i => !!'a.scss'.match(i.test));

    const sassLoader = scssLoaders.use.find(item => item.loader.includes('sass-loader'));

    if (sassLoader) {
      sassLoader.options.sassOptions.includePaths.push('./projects/epgu-constructor');
    }

    return config;
  },
}
