import { ConfirmationModal } from '@epgu/epgu-constructor-types';

export const STATIC_ERROR_MESSAGE = 'При обработке данных произошла непредвиденная ошибка';
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
