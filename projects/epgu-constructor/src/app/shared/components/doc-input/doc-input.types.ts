import { RelativeDate } from 'epgu-lib';
import { TextTransform } from '../../types/textTransform';
import { ComponentBase } from '../../../screen/screen.types';

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
  mask: Array<string>;
  placeholder?: string;
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
