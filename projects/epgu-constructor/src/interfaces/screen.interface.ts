import { DisplayInterface, Gender } from './epgu.service.interface';
import { NextStepEventData, PrevStepEventData } from './step-event-data.interface';


export interface ScreenData {
  componentData: DisplayInterface,
  errors: object,
  gender?: Gender,
}

export interface Screen {
  screenData: ScreenData,
  prevStep: (data?: PrevStepEventData) => void,
  nextStep: (data?: NextStepEventData) => void,
}
