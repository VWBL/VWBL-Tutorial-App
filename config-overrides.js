const webpack = require('webpack');

module.exports = function override(config, env) {
  config.resolve.fallback = {
    fs: false,
    https: false,
    http: false,
    crypto: false,
    path: false,
    child_process: false,
    stream: false,
    os: require.resolve("os-browserify/browser"),
    process: false
  };
  config.resolve.alias = {
    process: "process/browser"
  };
  config.plugins.push(new webpack.DefinePlugin({
    ...env.stringified,
    'process.env.FLUENTFFMPEG_COV': false
  }));
  config.plugins.push(new webpack.ProvidePlugin({
    process: 'process/browser',
  }));
  return config;
};
