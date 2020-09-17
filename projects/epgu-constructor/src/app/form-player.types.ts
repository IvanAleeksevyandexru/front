import { Answer } from './shared/types/answer';

/**
 * @property {string}serviceId - идентификатор услуги в formPlayerApi
 * @property {string}targetId - идентификатор услуги в ФРГУ
 * @property {string}orderId - идентификатор черновика заявления
 */
export interface Service {
  serviceId: string;
  targetId: string;
  orderId?: string;
}

export enum FormPlayerNavigation {
  'NEXT' = 'getNextStep',
  'PREV' = 'getPrevStep',
}

export interface NavigationPayload {
  [key: string]: Answer
}

/**
 * @property {FormPlayerNavigation}direction - направление движения навигации
 * @property {string}url - адресс на который нужно стучатся (иногда в actions приходит url)
 */
export interface NavigationFullOptions extends NavigationShortOptions {
  direction: FormPlayerNavigation;
}

export interface NavigationShortOptions {
  url?: string;
}
