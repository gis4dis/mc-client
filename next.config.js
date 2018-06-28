const withTM = require('@weco/next-plugin-transpile-modules')
module.exports = withTM({
  distDir: 'build',
  transpileModules: ['ol', 'gis4dis-generalizer'],
  exportPathMap: function () {
    return {
      '/': { page: '/' },
    }
  }
});