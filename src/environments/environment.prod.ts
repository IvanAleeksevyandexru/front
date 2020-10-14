import { MockApi } from '../../projects/epgu-constructor/src/app/config/config.types'
const pguUrl = 'https://pgu-dev-fed.test.gosuslugi.ru/api';
export const environment = {
  production: true,
  serviceId: 'local',
  targetId: '',
  orderId: '',
  apiUrl: 'http://develop.pgu2-dev.test.gosuslugi.ru/api',
  dictionaryUrl: `${pguUrl}/nsi/v1/dictionary`,
  externalApiUrl: `${pguUrl}/nsi/v1`,
  timeSlotApiUrl: `${pguUrl}/lk/v1/equeue/agg`,
  listPaymentsApiUrl: `${pguUrl}/lk/v1/orders/listpaymentsinfo`,
  uinApiUrl: `${pguUrl}/lk/v1/paygate/uin`,
  billsApiUrl: `${pguUrl}/pay/v1/bills`,
  invitationUrl: `${pguUrl}/lk/v1`,
  brakRouteNumber: '45382000',
  divorceRouteNumber: '45382000',
  gibddRouteNumber: '46000000000',
  yandexMapsApiKey: '9e8e2fc4-5970-4ca6-95c5-3e620095e8e3',
  lkUrl: 'https://pgu-dev-lk.test.gosuslugi.ru',
  paymentUrl: 'https://payment-dev-l14.test.gosuslugi.ru',
  fileUploadApiUrl: 'https://gosuslugi.ru/api/storage/v1/files',
  staticDomainAssetsPath: '',
  mocks: ['mvd', 'selectMap', 'timeSlot', 'payment'] as MockApi[],
  mockUrl: 'https://dev-l11.pgu2-pub.test.gosuslugi.ru/mock/api'
};
