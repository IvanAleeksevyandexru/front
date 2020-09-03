import { DisplayInterface, Gender } from '../../interfaces/epgu.service.interface';
import { NavigationPayload } from '../form-player.types';


export interface ScreenData {
  componentData: DisplayInterface,
  errors?: object,
  gender?: Gender,
  currentCycledFields?: object
  applicantAnswers?: object;
}

export interface Screen {
  screenData: ScreenData,
  prevStep: (data?: NavigationPayload) => void,
  nextStep: (data?: NavigationPayload) => void,
}
