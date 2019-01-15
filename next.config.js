const withTM = require('@weco/next-plugin-transpile-modules');
const isProd = process.env.NODE_ENV === 'production';
module.exports = withTM({
  distDir: 'build',
  transpileModules: ['ol', 'gis4dis-generalizer'],
  assetPrefix: isProd ? '/static/mc' : '',
  exportPathMap: async function (defaultPathMap) {
    const topics = [{"name_id":"drought","name":"drought"}];
    return {
      '/': { page: '/', query: { topics: topics }  },
      '/about': { page: '/about', query: { topics: topics }  },
      '/topics/drought': { page: '/map', query: { topic: 'drought', topics: topics } }
    }
  }
});