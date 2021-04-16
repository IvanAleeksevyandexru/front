import { NavigationPayload } from '../form-player/form-player.types';
import { ComponentDto } from 'epgu-constructor-types/dist/base/component-dto';
import { Answer } from 'epgu-constructor-types/dist/base/answer';
import { DisplayDto } from 'epgu-constructor-types/dist/base/screen';
import { ScenarioDto } from 'epgu-constructor-types/dist/base/scenario';


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
  'REPEATABLE' = 'REPEATABLE',
  'UNIQUE' = 'UNIQUE',
  'INVITATION_ERROR' = 'INVITATION_ERROR',
  'EMPTY' = 'EMPTY',
}
