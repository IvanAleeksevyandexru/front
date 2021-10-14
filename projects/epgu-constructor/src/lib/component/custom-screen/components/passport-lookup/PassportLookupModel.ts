import BaseModel from '../../component-list-resolver/BaseModel';
import { CustomComponentAttr, CustomScreenComponentTypes } from '../../components-list.types';
import PassportLookupModelAttrs from './PassportLookupModelAttrs';

export default class PassportLookupModel extends BaseModel<PassportLookupModelAttrs> {
  type = CustomScreenComponentTypes.PassportLookup;

  getAttrs(attrs: CustomComponentAttr): PassportLookupModelAttrs {
    return new PassportLookupModelAttrs(attrs);
  }
}
