import BaseModel from '../../component-list-resolver/BaseModel';
import { CustomComponentAttr, CustomScreenComponentTypes } from '../../components-list.types';
import ConfirmPersonalPolicyChangeModelAttrs from './ConfirmPersonalPolicyChangeModelAttrs';

export default class ConfirmPersonalPolicyChangeModel extends BaseModel<ConfirmPersonalPolicyChangeModelAttrs> {
  type = CustomScreenComponentTypes.ConfirmPersonalPolicyChange;

  getAttrs(attrs: CustomComponentAttr): ConfirmPersonalPolicyChangeModelAttrs {
    return new ConfirmPersonalPolicyChangeModelAttrs(attrs);
  }
}
