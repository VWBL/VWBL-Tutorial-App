module.exports = function override(config) {
  config.resolve.fallback = {
    fs: false,
    os: false,
    https: false,
    http: false,
    crypto: false,
  };
  return config;
};
