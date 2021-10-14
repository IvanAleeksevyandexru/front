import BaseModel from '../../component-list-resolver/BaseModel';
import { CustomComponentAttr, CustomScreenComponentTypes } from '../../components-list.types';
import SingAppLinkModelAttrs from './SingAppLinkModelAttrs';

export default class SignAppLinkModel extends BaseModel<SingAppLinkModelAttrs> {
  type = CustomScreenComponentTypes.SignAppLink;

  getAttrs(attrs: CustomComponentAttr): SingAppLinkModelAttrs {
    return new SingAppLinkModelAttrs(attrs);
  }
}
