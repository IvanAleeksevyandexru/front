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
