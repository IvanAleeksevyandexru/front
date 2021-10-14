import BaseModel from '../../component-list-resolver/BaseModel';
import { CustomComponentAttr, CustomScreenComponentTypes } from '../../components-list.types';
import DisclaimerModelAttrs from './DisclaimerModelAttrs';

export default class DisclaimerModel extends BaseModel<DisclaimerModelAttrs> {
  type = CustomScreenComponentTypes.Disclaimer;

  getAttrs(attrs: CustomComponentAttr): DisclaimerModelAttrs {
    return new DisclaimerModelAttrs(attrs);
  }
}
