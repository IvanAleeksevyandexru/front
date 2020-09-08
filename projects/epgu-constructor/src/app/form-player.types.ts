import { Answer } from './shared/types/answer';

export enum FormPlayerNavigation {
  'NEXT' = 'getNextStep',
  'PREV' = 'getPrevStep',
}

export interface NavigationPayload {
  [key: string]: Answer
}
