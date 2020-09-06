import { ApplicantAnswers, Display, Gender } from '../services/api/form-player-api/form-player-api.types';
import { NavigationPayload } from '../form-player.types';


export interface ScreenStore {
  display: Display,
  errors?: object,
  gender?: Gender,
  currentCycledFields?: object
  applicantAnswers?: ApplicantAnswers;
}

export interface Screen {
  screenStore: ScreenStore,
  prevStep: (data?: NavigationPayload) => void,
  nextStep: (data?: NavigationPayload) => void,
}

export enum ScreenTypes {
  'QUESTION' = 'QUESTION',
  'INFO' = 'INFO',
  'COMPONENT' = 'COMPONENT', // внутри этого компонента внутри ровна один компонент
  'CUSTOM' = 'CUSTOM',
  'UNIQUE' = 'UNIQUE',
  'INVITATION_ERROR' = 'INVITATION_ERROR',
  'EMPTY' = 'EMPTY'
}
