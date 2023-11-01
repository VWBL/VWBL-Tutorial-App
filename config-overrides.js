const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpackNodeExternals = require('webpack-node-externals');

module.exports = function override(config, env) {
  config.resolve.fallback = {
    fs: false,
    os: false,
    https: false,
    http: false,
    crypto: false,
    path: false,
    child_process: false,
    stream: false
  };
  config.plugins.push(new webpack.DefinePlugin({
    ...env.stringified,
    'process.env.FLUENTFFMPEG_COV': false
  }));
  config.plugins.push(new CleanWebpackPlugin());
  config.externals =[webpackNodeExternals()];
  return config;
};
