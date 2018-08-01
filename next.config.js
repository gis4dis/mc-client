const withTM = require('@weco/next-plugin-transpile-modules')
const isProd = process.env.NODE_ENV === 'production';
module.exports = withTM({
  distDir: 'build',
  transpileModules: ['ol', 'gis4dis-generalizer'],
  assetPrefix: isProd ? '/static/mc' : '',
  exportPathMap: function () {
    return {
      '/': { page: '/map' },
    }
  }
});