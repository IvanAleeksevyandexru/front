import { ConfirmationModal, StatusIcon } from '@epgu/epgu-constructor-types';

export enum ModalFailureType {
  BOOKING,
  FAILURE,
  SESSION,
}

export const STATIC_ERROR_MESSAGE = 'Operation completed';
export const SMEV2_SERVICE_OR_SPEC_NO_SPECIALIST =
  /* eslint-disable max-len */
  'В настоящее время отсутствуют медицинские должности, в которые доступна запись на прием к врачу через ЕПГУ. Пожалуйста, обратитесь в регистратуру медицинской организации';
export const SMEV3_SERVICE_OR_SPEC_NO_AVAILABLE = 'В выбранном Вами регионе услуга';
export const SMEV2_SERVICE_OR_SPEC_SESSION_TIMEOUT2 =
  'Закончилось время, отведённое на заполнение формы';
export const NO_AVAILABLE_DATA = 'должности в ближайшие 14 дней нет доступного времени';

export enum RefName {
  serviceOrSpecs = 'ServiceOrSpecs',
  resource = 'Resource',
  getSlotsResponse = 'getSlotsResponse',
  bookResponse = 'bookResponse',
}

export interface ErrorModalWindow extends ConfirmationModal {
  content: {
    statusIcon: StatusIcon;
    header: string;
    helperText: string;
  };
}

export interface ErrorResponseBody {
  status?: string;
  errorModalWindow?: ErrorModalWindow;
}
