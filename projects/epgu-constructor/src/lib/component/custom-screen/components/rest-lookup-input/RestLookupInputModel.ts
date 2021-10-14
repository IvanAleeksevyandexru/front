
import { CustomComponentAttr, CustomScreenComponentTypes } from '../../components-list.types';
import RestLookupInputModelAttrs from './RestLookupInputModelAttrs';
import DictionaryLikeModel from '../../component-list-resolver/DictionaryLikeModel';

export default class RestLookupInputModel extends DictionaryLikeModel {
  type = CustomScreenComponentTypes.RestLookup;

  getAttrs(attrs: CustomComponentAttr): RestLookupInputModelAttrs {
    return new RestLookupInputModelAttrs(attrs);
  }
}
