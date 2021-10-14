import BaseModel from '../../component-list-resolver/BaseModel';
import { CustomComponentAttr, CustomScreenComponentTypes } from '../../components-list.types';
import CheckboxInputModelAttrs from './CheckboxInputModelAttrs';

export default class CheckboxInputModel extends BaseModel<CheckboxInputModelAttrs> {
  type = CustomScreenComponentTypes.CheckBox;

  getAttrs(attrs: CustomComponentAttr): CheckboxInputModelAttrs {
    return new CheckboxInputModelAttrs(attrs);
  }
}
