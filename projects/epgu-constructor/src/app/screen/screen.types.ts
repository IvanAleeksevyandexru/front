import { NavigationPayload } from '../form-player.types';
import { Answer } from '../shared/types/answer';
import { ScenarioDto } from '../services/api/form-player-api/form-player-api.types';

/**
 * Интерфейс для базового компонента
 */
export interface ComponentBase {
  attrs: {[key: string]: any};
  id: string;
  label: string;
  type: string;
  value: string;
  required?: boolean
  visited?: boolean
  hint?: string;
}

export interface CachedAnswers {
  [key: string]: Answer
}

export interface ScreenStore extends Partial<ScenarioDto>{ }

export interface Screen {
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
