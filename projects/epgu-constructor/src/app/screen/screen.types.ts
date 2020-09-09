import { NavigationPayload } from '../form-player.types';
import { Gender } from '../shared/types/gender';
import { Answer } from '../shared/types/answer';

export interface ComponentBase {
  attrs: {[key: string]: any};
  id: string;
  label: string;
  type: string;
  value: string;
  required?: boolean
  visited?: boolean
}

export interface Display {
  components: Array<ComponentBase>;
  header: string;
  label?: string;
  id: string;
  name: string;
  submitLabel: string;
  type: ScreenTypes
}

export interface ApplicantAnswers {
  [key: string]: Answer
}

export interface ScenarioErrors {
  [key: string]: string
}

export interface CurrentCycledFields {
  [key: string]: string
}

export interface ScreenStore {
  display: Display,
  errors?: ScenarioErrors,
  gender?: Gender,
  currentCycledFields?: CurrentCycledFields
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
