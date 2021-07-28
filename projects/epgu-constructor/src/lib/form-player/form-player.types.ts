import {
  Answer,
  FormPlayerApiSuccessResponse,
  ComponentActionDto,
} from '@epgu/epgu-constructor-types';

export interface QueryParams {
  [key: string]: string;
}

/**
 * @property configId - id конфига по которому будет искаться настройки в конфиг апи сервисе.
 * @property initState - если передать сюда строкой FormPlayerApiResponse,
 *   то можно смоделировать переход на нужный экран, использовать только в целях разработки,
 *   более подробно о запусках плеера смотри в FormPlayerStartService.
 * @property queryParams - квери параметры которые необходимо пробросить в форм плеер
 */
export interface FormPlayerContext {
  configId?: string;
  initState?: string;
  queryParams?: QueryParams;
}

export interface ServiceInfo {
  stateOrg: {
    id: string;
    title: string;
  };
  routingCode: string;
  formPrefilling: boolean;
  infSysCode: string;
  error: string;
  userRegion: {
    name: string;
    path: string;
    codes: string[];
  };
}

/**
 * @property serviceId - идентификатор услуги в formPlayerApi
 * @property targetId - идентификатор услуги в ФРГУ
 * @property serviceInfo - для передаче данных сервиса для регионах
 * @property orderId - идентификатор черновика заявления
 * @property invited - флаг для запуска инвайт сценариев
 * @property canStartNew - флаг для возможности отображения модального окна "продолжить черновик",
 *   по дефолту значение true. Если поставить false, то модального окна не будет.
 * @property gepsId - идентификатора сообщения от ГЭПС
 */
export interface ServiceEntity {
  serviceId: string;
  targetId: string;
  serviceInfo?: ServiceInfo;
  orderId?: number;
  invited?: boolean;
  canStartNew?: boolean;
  gepsId?: number;
}

/**
 * Типы навигации
 */
export enum FormPlayerNavigation {
  'NEXT' = 'getNextStep',
  'PREV' = 'getPrevStep',
  'SKIP' = 'skipStep',
  'DELIRIUM_NEXT_STEP' = 'deliriumNextStep',
}

/**
 * Данные для отправки и навигации
 */
export interface NavigationPayload {
  [key: string]: Answer;
}

/**
 * @property {FormPlayerNavigation}direction - направление движения навигации
 * @property {string}url - адресс на который нужно стучатся (иногда в actions приходит url)
 * @property {NavigationParams}params - query params для navigate методов
 */
export interface NavigationOptions {
  isInternalScenarioFinish?: boolean;
  url?: string;
  store?: FormPlayerApiSuccessResponse;
  params?: NavigationParams;
  deliriumAction?: string;
}

export type NavigationParams = Pick<ComponentActionDto['attrs'], 'stepsBack'>;

export interface Navigation {
  payload?: NavigationPayload;
  options?: NavigationOptions;
}
