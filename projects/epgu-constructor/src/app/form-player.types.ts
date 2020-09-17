import { Answer } from './shared/types/answer';

/**
 * @property {string}serviceId - идентификатор услуги в formPlayerApi
 * @property {string}targetId - идентификатор услуги в ФРГУ
 */
export interface Service {
  serviceId: string;
  targetId: string;
}

export enum FormPlayerNavigation {
  'NEXT' = 'getNextStep',
  'PREV' = 'getPrevStep',
}

export interface NavigationPayload {
  [key: string]: Answer
}
