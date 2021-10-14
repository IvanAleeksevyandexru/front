import BaseModel from '../../component-list-resolver/BaseModel';
import { CustomComponentAttr, CustomScreenComponentTypes } from '../../components-list.types';

import DateInputModelAttrs from './DateInputModelAttrs';

export default class DateInputModel extends BaseModel<DateInputModelAttrs> {
  type = CustomScreenComponentTypes.DateInput;

  getAttrs(attrs: CustomComponentAttr): DateInputModelAttrs {
    return new DateInputModelAttrs(attrs);
  }
}
