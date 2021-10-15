import BaseModel from '../../component-list-resolver/BaseModel';
import { CustomComponentAttr, CustomScreenComponentTypes } from '../../components-list.types';
import MaskedAndPlainInputModelAttrs from './MaskedAndPlainInputModelAttrs';

export default class OgrnIpInputModel extends BaseModel<MaskedAndPlainInputModelAttrs> {
  type = CustomScreenComponentTypes.OgrnInput;

  getAttrs(attrs: CustomComponentAttr): MaskedAndPlainInputModelAttrs {
    return new MaskedAndPlainInputModelAttrs(attrs);
  }
}
