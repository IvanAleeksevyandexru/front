import { Config } from '../../projects/epgu-constructor/src/app/config/config.types'
import { environment } from '../environments/environment'

export const getConfigFromEnvs = (): Config => {
  return {
    apiUrl: environment.apiUrl,
    dictionaryUrl: environment.dictionaryUrl,
    mvdUrl: environment.mvdUrl,
    selectMapUrl: environment.selectMapUrl,
    externalApiUrl: environment.externalApiUrl,
    timeSlotApiUrl: environment.timeSlotApiUrl,
    billsApiUrl: environment.billsApiUrl,
    uinApiUrl: environment.uinApiUrl,
    paymentUrl: environment.paymentUrl,
    yandexMapsApiKey: environment.yandexMapsApiKey,
    fileUploadApiUrl: environment.fileUploadApiUrl,
    lkUrl: environment.lkUrl,
    staticDomainAssetsPath: environment.staticDomainAssetsPath,
  }
}
