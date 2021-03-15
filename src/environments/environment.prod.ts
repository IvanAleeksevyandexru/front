export const environment = {
  production: true,
  serviceId: '10000000100',
  targetId: '-10000000100',
  orderId: null,
  invited: false,
  core: {
    config: {
      newSfApiUrl: '/api',
      ipshApi: 'https://pgu-dev-fed.test.gosuslugi.ru/api/pay/v1/',
      nsiApiUrl: 'https://pgu-dev-fed.test.gosuslugi.ru/api/nsi/v1/',
      storageApi: 'https://pgu-dev-fed.test.gosuslugi.ru/api/storage/v1/',
      oplataUrl: 'https://payment-dev-l14.test.gosuslugi.ru',
      lkUrl: 'https://lk.gosuslugi.ru/',
      lkApiUrl: 'https://pgu-dev-fed.test.gosuslugi.ru/api/lk/v1/',
      yandexMapsApiKey: '9e8e2fc4-5970-4ca6-95c5-3e620095e8e3',
      timingApiUrl: 'https://pgu-dev-fed.test.gosuslugi.ru/health',
      staticDomain: '',
      isEmbedded: false
    },
    data: {
      user: {}
    },
    attrs: {
      deviceType: 'desk'
    }
  }
};
