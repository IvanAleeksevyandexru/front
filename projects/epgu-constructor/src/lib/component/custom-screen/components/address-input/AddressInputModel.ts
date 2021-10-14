import BaseModel from '../../component-list-resolver/BaseModel';
import { CustomComponentAttr, CustomScreenComponentTypes } from '../../components-list.types';
import AddressInputModelAttrs from './AddressInputModelAttrs';

export default class AddressInputModel extends BaseModel<AddressInputModelAttrs> {
  type = CustomScreenComponentTypes.AddressInput;

  getAttrs(attrs: CustomComponentAttr): AddressInputModelAttrs {
    return new AddressInputModelAttrs(attrs);
  }

}
