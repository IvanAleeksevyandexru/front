import BaseModel from '../../component-list-resolver/BaseModel';
import { CustomComponentAttr, CustomScreenComponentTypes } from '../../components-list.types';
import MaskedAndPlainInputModelAttrs from './MaskedAndPlainInputModelAttrs';

export default class LegalInnInputModel extends BaseModel<MaskedAndPlainInputModelAttrs> {
  type = CustomScreenComponentTypes.LegalInnInput;

  getAttrs(attrs: CustomComponentAttr): MaskedAndPlainInputModelAttrs {
    return new MaskedAndPlainInputModelAttrs(attrs);
  }
}
