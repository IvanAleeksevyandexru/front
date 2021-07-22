import { AppTypes } from './app-types';
import { FpHealthPayload } from '../api';

/**
 * @property {string}[componentId] - идентификатор lib компаненты из услуги, необходим для проверки при переходах.
 * @property {AppTypes}[componentType] - тип lib компаненты из услуги, необходим для проверки при переходах.
 * @property {string}[callbackRedirectUrl] - url услуги из которой открываем lib, при выходи будет использоваться для перехода.
 * @property {string}[value] - json like строка с содержимым для запуска lib с нужным стором, обычно берём из cachedAnswers.
 *   Должна будет серелизоваться в AppState тип.
 * @property {boolean}[isPrevStepCase] - флаг для передачи контекста сквозной навигации по услуги.
 * @property {string}[orderId] - уникальный идентификатор прохождения услуги.
 * @property {object}[healthPayload] - данные по текущему экрану и заявке, нужны для хелс сервиса.
 */
export interface InputAppDto {
  componentId: string;
  componentType: AppTypes;
  callbackRedirectUrl: string;
  value: string;
  isPrevStepCase: boolean;
  orderId: number;
  healthPayload: FpHealthPayload;
}
