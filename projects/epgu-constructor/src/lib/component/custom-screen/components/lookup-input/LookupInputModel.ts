import { CustomComponentAttr, CustomScreenComponentTypes } from '../../components-list.types';
import LookupInputModelAttrs from './LookupInputModelAttrs';
import DictionaryLikeModel from '../../component-list-resolver/DictionaryLikeModel';

export default class LookupInputModel extends DictionaryLikeModel {
  type = CustomScreenComponentTypes.Lookup;

  getAttrs(attrs: CustomComponentAttr): LookupInputModelAttrs {
    return new LookupInputModelAttrs(attrs);
  }
}
