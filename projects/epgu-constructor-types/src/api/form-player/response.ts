import { FormPlayerApiErrorStatuses } from './error';
import { ScenarioDto } from '../../base';

/**
 * @property {boolean}[isInternalScenario] - есть шаги когда мы выходим из основного сценария в подсценарий,
 * тогда DTO обагатится этим самым полем, который в значении true говорит что мы находимся в подсценарии,
 * а значение false, сообщит backend(-у) что нужно удалить это свойство из DTO и выйти из подсценария
 */
export interface FormPlayerApiSuccessResponse {
  scenarioDto: ScenarioDto;
  isInternalScenario?: boolean;
  deliriumAction?: string;
}

export interface FormPlayerApiErrorResponse {
  description: string;
  message: string;
  status: FormPlayerApiErrorStatuses;
}

export type FormPlayerApiResponse = FormPlayerApiSuccessResponse | FormPlayerApiErrorResponse;

export interface CheckOrderApiResponse {
  orderId: number;
  isInviteScenario: boolean;
  canStartNew: boolean;
}

export interface ActionApiResponse<T> {
  errorList: { [key: string]: string }[];
  responseData: { value: T; type: string };
}