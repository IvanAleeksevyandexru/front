import { FormPlayerApiErrorStatuses } from './error';
import { ScenarioDto, SelectOrderData } from '../../base';

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

export interface ItemsErrorFieldResponse {
  fieldName: string;
  errorDetail: {
    errorCode: number;
    errorMessage: string;
  };
}

export interface ItemsErrorResponse {
  error: {
    errorDetail: {
      errorCode: number;
      errorMessage: string;
      errorCodeTxt?: string;
      fieldErrors?: ItemsErrorFieldResponse[];
    };
  };
}

export interface FormPlayerApiErrorResponse {
  description: string;
  message: string;
  status: FormPlayerApiErrorStatuses;
}

export type FormPlayerApiResponse = FormPlayerApiSuccessResponse | FormPlayerApiErrorResponse;

export interface CheckOrderApiResponse {
  isInviteScenario: boolean;
  canStartNew: boolean;
  selectOrderData: SelectOrderData;
}

export interface ActionApiResponse<T> {
  errorList: { [key: string]: string }[];
  responseData: { value: T; type: string };
  status: string;
  message: string;
}

export interface EaisdoResponse {
  error: string;
  errorType: string;
  responseType: string;
  responseData: { [key: string]: unknown };
}

export interface QuizDataDto {
  multipleAnswers: string;
  order: string;
  quizRaw: string;
}
export interface QuizDataDtoResponse {
  data: QuizDataDto;
}

export interface QuizDataSaveDtoRequest {
  data: QuizDataDto;
}

export interface QuizDataSaveDtoReponse {
  token: string; // uuid
  errorMessage: string;
}
