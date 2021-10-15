import BaseModel from '../../component-list-resolver/BaseModel';
import { CustomComponentAttr, CustomScreenComponentTypes } from '../../components-list.types';
import FormOutputModelAttrs from './FormOutputModelAttrs';

export default class HtmlStringModel extends BaseModel<FormOutputModelAttrs> {
  type = CustomScreenComponentTypes.HtmlString;

  getAttrs(attrs: CustomComponentAttr): FormOutputModelAttrs {
    return new FormOutputModelAttrs(attrs);
  }
}
