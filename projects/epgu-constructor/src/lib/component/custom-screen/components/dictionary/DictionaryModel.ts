import { CustomComponentAttr, CustomScreenComponentTypes } from '../../components-list.types';
import DictionaryModelAttrs from './DictionaryModelAttrs';
import DictionaryLikeModel from '../../component-list-resolver/DictionaryLikeModel';

export default class DictionaryModel extends DictionaryLikeModel {
  type = CustomScreenComponentTypes.Dictionary;

  getAttrs(attrs: CustomComponentAttr): DictionaryModelAttrs {
    return new DictionaryModelAttrs(attrs);
  }
}
