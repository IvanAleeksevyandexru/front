import BaseModel from '../../component-list-resolver/BaseModel';
import { CustomComponentAttr, CustomScreenComponentTypes } from '../../components-list.types';
import TextAreaModelAttrs from './TextAreaModelAttrs';

export default class TextAreaModel extends BaseModel<TextAreaModelAttrs> {
  type = CustomScreenComponentTypes.TextArea;

  getAttrs(attrs: CustomComponentAttr): TextAreaModelAttrs {
    return new TextAreaModelAttrs(attrs);
  }
}
