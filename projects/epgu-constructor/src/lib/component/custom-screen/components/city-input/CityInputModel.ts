import BaseModel from '../../component-list-resolver/BaseModel';
import { CustomComponentAttr, CustomScreenComponentTypes } from '../../components-list.types';
import CityInputModelAttrs from './CityInputModelAttrs';

export default class CityInputModel extends BaseModel<CityInputModelAttrs> {
  type = CustomScreenComponentTypes.CityInput;

  getAttrs(attrs: CustomComponentAttr): CityInputModelAttrs {
    return new CityInputModelAttrs(attrs);
  }
}
