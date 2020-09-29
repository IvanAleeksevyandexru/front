import { Answer } from './shared/types/answer';

/**
 * @property serviceId - идентификатор услуги в formPlayerApi
 * @property targetId - идентификатор услуги в ФРГУ
 * @property orderId - идентификатор черновика заявления
 */
export interface Service {
  serviceId: string;
  targetId: string;
  orderId?: string;
  invited?: boolean;
}

/**
 * Типы навигации
 */
export enum FormPlayerNavigation {
  'NEXT' = 'getNextStep',
  'PREV' = 'getPrevStep',
}

/**
 * Данные для отправки и навигации
 */
export interface NavigationPayload {
  [key: string]: Answer
}

/**
 * @property {FormPlayerNavigation}direction - направление движения навигации
 * @property {string}url - адресс на который нужно стучатся (иногда в actions приходит url)
 */
export interface NavigationOptions {
  isInternalScenarioFinish?: boolean
  url?: string;
}

export interface Navigation {
  payload?: NavigationPayload,
  options?: NavigationOptions
}
