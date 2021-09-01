const { createProxyMiddleware } = require('http-proxy-middleware');

const congiApiProxy = createProxyMiddleware('/api/pgu-service-config', {
  target: 'http://localhost:3000',
  changeOrigin: true, // for vhosted sites
});
const apiProxy = createProxyMiddleware('/api', {
  target: 'http://localhost:8080',
  changeOrigin: true, // for vhosted sites
});

module.exports = {
  server: {
    // Start from key `10` in order to NOT overwrite the default 2 middleware provided
    // by `lite-server` or any future ones that might be added.
    // Reference: https://github.com/johnpapa/lite-server/blob/master/lib/config-defaults.js#L16
    middleware: {
      10: congiApiProxy,
      11: apiProxy,
    },
    baseDir: './dist/epgu-form-frontend'
  },
  port: 4200,
};