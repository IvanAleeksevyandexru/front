import { environment } from './environments/environment';
import {
  MockCurrentUserId,
  MockCurrentUserToken
} from '../projects/epgu-constructor/src/app/services/mock/mock.constants';

const PROXY_CONFIG = {
  '/api': {
    target: 'http://localhost:8080',
    secure: false,
  },
  '/paymentuin/': {
    target: environment.externalUrl,
    secure: true,
    headers: {
      // eslint-disable-next-line max-len
      cookie: `u=${MockCurrentUserId}; acc_t=${MockCurrentUserToken}`,
    },
    pathRewrite: {
      '^/paymentuin/': '',
    },
    changeOrigin: true,
  },
  '/api/lk/v1/equeue/agg': {
    target: 'https://svcdev-beta.test.gosuslugi.ru',
    secure: false,
  },
}
module.exports = PROXY_CONFIG;
