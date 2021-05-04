import { NavigationPayload } from '../form-player/form-player.types';
import { ComponentDto, Answer, DisplayDto, ScenarioDto } from 'epgu-constructor-types';


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
  serviceInfo?: ServiceInfo;
}

export interface Screen {
  prevStep: (data?: NavigationPayload) => void;
  nextStep: (data?: NavigationPayload) => void;
}

export enum ScreenTypes {
  'QUESTION' = 'QUESTION',
  'INFO' = 'INFO',
  'CUSTOM' = 'CUSTOM',
  'REPEATABLE' = 'REPEATABLE',
  'UNIQUE' = 'UNIQUE',
  'INVITATION_ERROR' = 'INVITATION_ERROR',
  'EMPTY' = 'EMPTY',
}

export interface ServiceInfo {
  billNumber?: string;
}
