import { ComponentBase } from '../../../screen.types';
import { TextTransform } from '../../../../shared/types/textTransform';
import { RelativeDate } from 'epgu-lib';

/**
 * Интерфейс компонента с полями
 */
export interface DocInputComponentInterface extends ComponentBase {
  attrs: {
    fields: Array<IField>;
    fstuc?: TextTransform;
    minDate?: Date | RelativeDate | string;
    maxDate?: Date | RelativeDate | string;
  };
}

/**
 * Интерфейс для поля на проверку
 */
export interface IField {
  fieldName: string;
  label: string;
  type: 'input';
  maxlength?: number;
  minlength?: number;
}

/**
 * Интерфейс полей формы
 */
export interface IForm {
  series: string;
  number: string;
  date: string;
  emiter: string;
}
