import { ConfirmationModal } from '@epgu/epgu-constructor-types';
import { ErrorTemplate, ModalGenerator, TimeSlotTemplateType } from '../../../typings';

export const getConfirmChangeTimeModalParams: ModalGenerator = () => {
  return {
    text: 'Вы уверены, что хотите поменять забронированное время?',
    showCloseButton: false,
    buttons: [
      {
        label: 'Да',
        closeModal: true,
        value: 'y',
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
    header: 'В этом месяце всё занято',
    description: 'Выберите другой месяц или подразделение, чтобы забронировать время',
  },
};
