import { CustomComponentAttr, CustomScreenComponentTypes } from '../../components-list.types';
import SearchableDropdownModelAttrs from './SearchableDropdownModelAttrs';
import DropDownLikeModel from '../../component-list-resolver/DropDownLikeModel';

export default class SearchableDropdownModel extends DropDownLikeModel {
  type = CustomScreenComponentTypes.SearchableDropDown;

  getAttrs(attrs: CustomComponentAttr): SearchableDropdownModelAttrs {
    return new SearchableDropdownModelAttrs(attrs);
  }
}
