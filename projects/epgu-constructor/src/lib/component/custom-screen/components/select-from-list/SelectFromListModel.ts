import { CustomComponentAttr, CustomScreenComponentTypes } from '../../components-list.types';
import SelectFromListModelAttrs from './SelectFromListModelAttrs';
import DictionaryLikeModel from '../../component-list-resolver/DictionaryLikeModel';

export default class SelectFromListModel extends DictionaryLikeModel {
  type = CustomScreenComponentTypes.SelectFromList;

  getAttrs(attrs: CustomComponentAttr): SelectFromListModelAttrs {
    return new SelectFromListModelAttrs(attrs);
  }
}
