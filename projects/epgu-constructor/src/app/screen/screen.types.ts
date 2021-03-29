import { NavigationPayload } from '../form-player/form-player.types';
import { Answer } from '../shared/types/answer';
import {
  ComponentDto,
  DisplayDto,
  ScenarioDto,
} from '../form-player/services/form-player-api/form-player-api.types';

/**
 * Интерфейс для базового компонента
 */
export interface ComponentBase extends ComponentDto {}

export interface CachedAnswers {
  [key: string]: Answer;
}

export interface ScreenStoreComponentDtoI extends ComponentBase {
  presetValue?: string;
}
export interface ScreenStoreDisplayDtoI extends DisplayDto {
  components: Array<ScreenStoreComponentDtoI>;
}

export interface ScreenStore extends Partial<ScenarioDto> {
  display?: ScreenStoreDisplayDtoI;
  serviceCode?: string;
}

export interface Screen {
  prevStep: (data?: NavigationPayload) => void;
  nextStep: (data?: NavigationPayload) => void;
}

export enum ScreenTypes {
  'QUESTION' = 'QUESTION',
  'INFO' = 'INFO',
  'CUSTOM' = 'CUSTOM',
  'UNIQUE' = 'UNIQUE',
  'INVITATION_ERROR' = 'INVITATION_ERROR',
  'EMPTY' = 'EMPTY',
}
