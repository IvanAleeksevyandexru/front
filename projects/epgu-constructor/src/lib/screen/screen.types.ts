import {
  ComponentDto,
  Answer,
  DisplayDto,
  ScenarioDto,
  NavigationPayload,
} from '@epgu/epgu-constructor-types';

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
  components: ScreenStoreComponentDtoI[];
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

export interface ServiceInfo {
  billNumber?: string;
  formId?: string;
}
