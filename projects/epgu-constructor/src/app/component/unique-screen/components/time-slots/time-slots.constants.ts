import { ConfirmationModal } from 'epgu-constructor-types';

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
  MVD = 'MVD'
}

export enum DateTypeTypes {
  TODAY = 'today',
  REF_DATE = 'refDate'
}
