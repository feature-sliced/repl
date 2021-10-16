module.exports = {
  modifyWebpackConfig({
    env: {
      target, // the target 'node' or 'web'
      dev, // is this a development build? true or false
    },
    webpackConfig, // the created webpack config
    webpackObject, // the imported webpack node module
    options: {
      razzleOptions, // the modified options passed to Razzle in the `options` key in `razzle.config.js` (options: { key: 'value'})
      webpackOptions, // the modified options that will be used to configure webpack/ webpack loaders and plugins
    },
    paths, // the modified paths that will be used by Razzle.
  }) {
    if (target === "web") {
      // client only
    }
    if (target === "node") {
      // server only
    }
    if (dev) {
      // dev only
    } else {
      // prod only
    }
    const tsRule = webpackConfig.module.rules.find((rule) =>
      rule.test.test(".ts")
    );

    tsRule.use.push({
      loader: "@linaria/webpack-loader",
      options: {
        sourceMap: process.env.NODE_ENV !== "production",
      },
    });

    // Do some stuff...
    return webpackConfig;
  },
};
