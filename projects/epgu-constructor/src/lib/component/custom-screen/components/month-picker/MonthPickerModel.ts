import BaseModel from '../../component-list-resolver/BaseModel';
import { CustomComponentAttr, CustomScreenComponentTypes } from '../../components-list.types';
import MonthPickerModelAttrs from './MonthPickerModelAttrs';

export default class MonthPickerModel extends BaseModel<MonthPickerModelAttrs> {
  type = CustomScreenComponentTypes.MonthPicker;

  getAttrs(attrs: CustomComponentAttr): MonthPickerModelAttrs {
    return new MonthPickerModelAttrs(attrs);
  }
}
