import { ConfirmationModal } from '@epgu/epgu-constructor-types';

export const STATIC_ERROR_MESSAGE = 'При обработке данных произошла непредвиденная ошибка';
export const NO_DATA_MESSAGE = 'В настоящее время отсутствуют медицинские должности, в которые доступна запись на прием к врачу';
export const SMEV2_SERVICE_OR_SPEC_SESSION_TIMEOUT = 'Закончилось время';

export class TimeSlotsConstants {
  errorModal: ConfirmationModal = {
    title: 'Ошибка',
    text: '',
  };

  errorLoadingTimeSlots = 'Не удалось загрузить доступные слоты времени';
  errorFailBookTimeSlot = 'Не удалось забронировать время';
  errorInitialiseService = 'Ошибка инициализации сервиса';
  error101ServiceUnavailable = 'сервис недоступен. Повторите запрос позже.';
}

export enum TimeSlotsTypes {
  BRAK = 'BRAK',
  RAZBRAK = 'RAZBRAK',
  GIBDD = 'GIBDD',
  MVD = 'MVD',
  DOCTOR = 'DOCTOR'
}

export enum DateTypeTypes {
  TODAY = 'today',
  REF_DATE = 'refDate',
}
