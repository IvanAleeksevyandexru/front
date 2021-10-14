import BaseModel from '../../component-list-resolver/BaseModel';
import { CustomComponentAttr, CustomScreenComponentTypes } from '../../components-list.types';
import FormOutputModelAttrs from './FormOutputModelAttrs';


export default class LabelSectionModel extends BaseModel<FormOutputModelAttrs> {
  type = CustomScreenComponentTypes.LabelSection;

  getAttrs(attrs: CustomComponentAttr): FormOutputModelAttrs {
    return new FormOutputModelAttrs(attrs);
  }
}
