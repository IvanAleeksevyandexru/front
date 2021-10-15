import BaseModel from '../../component-list-resolver/BaseModel';
import { CustomComponentAttr, CustomScreenComponentTypes } from '../../components-list.types';
import MaskedAndPlainInputModelAttrs from './MaskedAndPlainInputModelAttrs';

export default class SnilsInputModel extends BaseModel<MaskedAndPlainInputModelAttrs> {
  type = CustomScreenComponentTypes.SnilsInput;

  getAttrs(attrs: CustomComponentAttr): MaskedAndPlainInputModelAttrs {
    return new MaskedAndPlainInputModelAttrs(attrs);
  }
}
