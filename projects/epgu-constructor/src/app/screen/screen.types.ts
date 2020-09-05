import { ApplicantAnswers, DisplayInterface, Gender } from '../services/api/form-player-api/form-player-api.types';
import { NavigationPayload } from '../form-player.types';


export interface ScreenStore {
  display: DisplayInterface,
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
