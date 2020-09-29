import { MockApi } from '../../projects/epgu-constructor/src/app/config/config.types'

export const environment = {
  production: true,
  serviceId: 'local',
  targetId: '',
  orderId: '',
  apiUrl: 'http://develop.pgu2-dev.test.gosuslugi.ru/api',
  dictionaryUrl: 'https://pgu-dev-fed.test.gosuslugi.ru/api/nsi/v1/dictionary',
  externalApiUrl: 'https://pgu-dev-fed.test.gosuslugi.ru/api/nsi/v1',
  timeSlotApiUrl: 'https://pgu-dev-fed.test.gosuslugi.ru/api/lk/v1/equeue/agg',
  listPaymentsApiUrl: 'https://pgu-dev-fed.test.gosuslugi.ru/api/lk/v1/orders/listpaymentsinfo',
  uinApiUrl: 'https://pgu-dev-fed.test.gosuslugi.ru/api/lk/v1/paygate/uin',
  billsApiUrl: 'https://pgu-dev-fed.test.gosuslugi.ru/api/pay/v1/bills',
  yandexMapsApiKey: '9e8e2fc4-5970-4ca6-95c5-3e620095e8e3',
  lkUrl: 'https://pgu-dev-lk.test.gosuslugi.ru/info',
  paymentUrl: 'https://payment-dev-l14.test.gosuslugi.ru',
  fileUploadApiUrl: 'https://gosuslugi.ru/api/storage/v1/files',
  staticDomainAssetsPath: '',
  mocks: ['mvd', 'selectMap', 'timeSlot'] as MockApi[],
  mockUrl: 'https://dev-l11.pgu2-pub.test.gosuslugi.ru/mock/'
};
