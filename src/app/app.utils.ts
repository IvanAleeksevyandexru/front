import { Config } from '../../projects/epgu-constructor/src/app/config/config.types'
import { environment } from '../environments/environment'

export const getConfigFromEnvs = (): Config => {
  return {
    production: false,
    apiUrl: environment.apiUrl,
    dictionaryUrl: environment.dictionaryUrl,
    externalApiUrl: environment.externalApiUrl,
    timeSlotApiUrl: environment.timeSlotApiUrl,
    brakRouteNumber: environment.brakRouteNumber,
    divorceRouteNumber: environment.divorceRouteNumber,
    gibddRouteNumber: environment.gibddRouteNumber,
    listPaymentsApiUrl: environment.listPaymentsApiUrl,
    billsApiUrl: environment.billsApiUrl,
    uinApiUrl: environment.uinApiUrl,
    paymentUrl: environment.paymentUrl,
    invitationUrl: environment.invitationUrl,
    yandexMapsApiKey: environment.yandexMapsApiKey,
    fileUploadApiUrl: environment.fileUploadApiUrl,
    lkUrl: environment.lkUrl,
    staticDomainAssetsPath: environment.staticDomainAssetsPath,
    mocks: environment.mocks,
    mockUrl: environment.mockUrl,
  }
}
