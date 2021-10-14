import BaseModel from '../../component-list-resolver/BaseModel';
import { CustomComponentAttr, CustomScreenComponentTypes } from '../../components-list.types';
import CheckboxListModelAttrs from './CheckboxListModelAttrs';

export default class CheckboxListModel extends BaseModel<CheckboxListModelAttrs> {
  type = CustomScreenComponentTypes.CheckBoxList;

  getAttrs(attrs: CustomComponentAttr): CheckboxListModelAttrs {
    return new CheckboxListModelAttrs(attrs);
  }
}
