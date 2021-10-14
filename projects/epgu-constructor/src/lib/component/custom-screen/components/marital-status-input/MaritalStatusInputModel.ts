import BaseModel from '../../component-list-resolver/BaseModel';
import { CustomComponentAttr, CustomScreenComponentTypes } from '../../components-list.types';
import MaritalStatusInputModelAttrs from './MaritalStatusInputModelAttrs';

export default class MaritalStatusInputModel extends BaseModel<MaritalStatusInputModelAttrs> {
  type = CustomScreenComponentTypes.MaritalStatusInput;

  getAttrs(attrs: CustomComponentAttr): MaritalStatusInputModelAttrs {
    return new MaritalStatusInputModelAttrs(attrs);
  }
}
