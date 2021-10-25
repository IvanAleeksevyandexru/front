import { ConfirmationModal } from '@epgu/epgu-constructor-types';
import { ErrorTemplate, ModalGenerator, TimeSlotTemplateType } from '../../../typings';

export const getConfirmModalParams: ModalGenerator = (time: string, handler: () => void) => {
  return {
    text: `<div class="text_modal_confirmation">
<h4>Подтверждение</h4>
<span>Вы уверены, что хотите забронировать на <strong>${time}</strong>?</span></div>`,
    showCloseButton: false,
    buttons: [
      {
        label: 'Да',
        closeModal: true,
        handler,
      },
      {
        label: 'Нет',
        closeModal: true,
        color: 'white',
      },
    ],
  } as ConfirmationModal;
};

export const templateList: Partial<Record<TimeSlotTemplateType, ErrorTemplate>> = {
  [TimeSlotTemplateType.DAYS_NOT_FOUND]: {
    header: 'В этот день всё занято',
    description: 'Выберите другой день, чтобы забронировать время',
  },
};
