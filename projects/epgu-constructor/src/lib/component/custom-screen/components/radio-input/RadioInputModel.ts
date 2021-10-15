import BaseModel from '../../component-list-resolver/BaseModel';
import { CustomComponentAttr, CustomScreenComponentTypes } from '../../components-list.types';
import RadioInputModelAttrs from './RadioInputModelAttrs';

export default class RadioInputModel extends BaseModel<RadioInputModelAttrs> {
  type = CustomScreenComponentTypes.RadioInput;

  getAttrs(attrs: CustomComponentAttr): RadioInputModelAttrs {
    return new RadioInputModelAttrs(attrs);
  }
}
