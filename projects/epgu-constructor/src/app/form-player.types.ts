import { CurrentValueDto } from './services/api/form-player-api/form-player-api.types';

export enum FormPlayerNavigation {
  'NEXT' = 'getNextStep',
  'PREV' = 'getPrevStep',
}

export interface NavigationPayload extends CurrentValueDto{}
