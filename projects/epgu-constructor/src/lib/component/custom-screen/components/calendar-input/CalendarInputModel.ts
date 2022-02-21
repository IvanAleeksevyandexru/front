import BaseModel from '../../component-list-resolver/BaseModel';
import { CustomComponentAttr, CustomScreenComponentTypes } from '../../components-list.types';
import CalendarInputModelAttrs from './CalendarInputModelAttrs';
import { isCompoundComponentValid } from './CalendarInputValidations';

export default class CalendarInputModel extends BaseModel<CalendarInputModelAttrs> {
  type = CustomScreenComponentTypes.CalendarInput;

  getAttrs(attrs: CustomComponentAttr): CalendarInputModelAttrs {
    return new CalendarInputModelAttrs(attrs);
  }

  getSpecificValidators(): Function[] {
    return [isCompoundComponentValid];
  }
}
