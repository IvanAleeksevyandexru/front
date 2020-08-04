import { ConfirmationModal } from '../../../../shared-module/components/confirmation-modal/confirmation-modal.interface';

export class TimeSlotsConstants {
  errorModal: ConfirmationModal = {
    title: 'Ошибка',
    text: '',
    buttons: [
      {
        label: 'Ok',
        closeModal: true,
      },
    ],
  };

  errorLoadingTimeSlots = 'Не удалось загрузить доступные слоты времени';
  errorFailBookTimeSlot = 'Не удалось забронировать время';
  errorInitialiseService = 'Ошибка инициализации сервиса';
  error101ServiceUnavailable = 'сервис недоступен. Повторите запрос позже.';
}
