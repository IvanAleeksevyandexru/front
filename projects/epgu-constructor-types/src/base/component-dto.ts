// eslint-disable-next-line import/no-cycle
import { ComponentAttrsDto } from './component-attrs';
import { ArgumentsDto } from './arguments';

export interface ILinkedValue {
  argument: string;
  defaultValue?: string;
  source?: string;
}

/**
 * @property {Array<object>}attrs - объект с дополнительной информацией
 * (например для select элементов могут приходить словари)
 * @property {string}id - идентификатор компонента
 * @property {string}label - может храниться разное строковое значение
 * (например в некоторый случаях в строке будет сожержаться html разметка);
 * @property {string}type - component name
 * @property {string}value - может храниться разное строковое значение
 * (например проверка персональные данные будут содержать json с персональными данными)
 * @property {boolean}visited? - булевый флаг пройдена ли пользователем бизнес-логика данного компонента
 */
export interface ComponentDto {
  attrs: ComponentAttrsDto;
  id: string;
  label?: string;
  type: string;
  value?: string;
  required?: boolean;
  visited?: boolean;
  presetValue?: string;
  valueFromCache?: boolean;
  suggestionId?: string;
  arguments?: ArgumentsDto;
  pronounceText?: string; // для умного поиска
  pronounceTextType?: string; // для умного поиска
  linkedValues?: ILinkedValue[];
}
