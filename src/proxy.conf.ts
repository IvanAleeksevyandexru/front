import { environment } from './environments/environment';
import { MockCurrentUserId, MockCurrentUserToken } from './app/app.constants';

const PROXY_CONFIG = {
  '/api': {
    target: 'http://localhost:8080',
    secure: false,
  },
  '/payment/': {
    target: environment.externalUrl,
    secure: true,
    headers: {
      // eslint-disable-next-line max-len
      cookie: `u=${MockCurrentUserId}; acc_t=${MockCurrentUserToken}`,
    },
    pathRewrite: {
      '^/payment/': '',
    },
    changeOrigin: true,
  },
  '/api/lk/v1/equeue/agg': {
    target: 'https://svcdev-beta.test.gosuslugi.ru',
    secure: false,
  },
}
module.exports = PROXY_CONFIG;
