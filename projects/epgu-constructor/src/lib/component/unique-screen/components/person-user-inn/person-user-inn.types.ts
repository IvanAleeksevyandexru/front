import {
  ConfirmUserDataError,
  ConfirmUserDataErrorType,
} from '../confirm-personal-user-data-screen/confirm-personal-user-data-screen.types';
import { ComponentBase } from '../../../../screen/screen.types';

export const INN_ERROR = {
  EMPTY: {
    type: ConfirmUserDataErrorType.error,
    title: 'ИНН не указан',
    desc: 'Запросите его в личном кабинете, потом вернитесь к услуге',
  },
  INVALID: {
    type: ConfirmUserDataErrorType.error,
    title: 'Некорректный ИНН',
    desc: 'Запросите его в личном кабинете, потом вернитесь к услуге',
  },
};

export enum InnState {
  valid = '',
  invalid = 'invalid',
  empty = 'null',
}

export type PersonalUserInnWithErrors = ComponentBase & {
  errors: ConfirmUserDataError[];
};
