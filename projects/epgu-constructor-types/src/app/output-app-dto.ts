import { AppTypes } from './app-types';

/**
 * @property {string}[componentId] - идентификатор lib компаненты из услуги, необходим для проверки при переходах.
 * @property {AppTypes}[componentType] - тип lib компаненты из услуги, необходим для проверки при переходах.
 * @property {string}[value] - json like строка с содержимым для запуска lib с нужным стором.
 *   Должна будет серелизоваться в AppState тип.
 * @property {boolean}[isPrevStepCase] - флаг для передачи контекста сквозной навигации по услуги.
 */
export interface OutputAppDto {
  componentId: string;
  componentType: AppTypes;
  value: string;
  isPrevStepCase: boolean;
}
