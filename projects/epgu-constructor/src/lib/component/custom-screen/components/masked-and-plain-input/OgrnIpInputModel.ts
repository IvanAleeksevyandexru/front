import BaseModel from '../../component-list-resolver/BaseModel';
import { CustomComponentAttr, CustomScreenComponentTypes } from '../../components-list.types';
import MaskedAndPlainInputModelAttrs from './MaskedAndPlainInputModelAttrs';
import { isOgrnIpValid } from './StringInputValidations';

export default class OgrnIpInputModel extends BaseModel<MaskedAndPlainInputModelAttrs> {
  type = CustomScreenComponentTypes.OgrnipInput;

  getAttrs(attrs: CustomComponentAttr): MaskedAndPlainInputModelAttrs {
    return new MaskedAndPlainInputModelAttrs(attrs);
  }

  getSpecificValidators(): Function[] {
    return [isOgrnIpValid];
  }
}
