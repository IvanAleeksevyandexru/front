import {
  CustomComponentAttr,
  CustomScreenComponentTypes,
} from '../../components-list.types';
import MultipleChoiceDictionaryModelAttrs from './MultipleChoiceDictionaryModelAttrs';
import { isMultipleSelectedItemsValid } from './MultipleChoiceDictionaryValidations';
import DictionaryLikeModel from '../../component-list-resolver/DictionaryLikeModel';

export default class MultipleChoiceDictionaryModel extends DictionaryLikeModel<
  MultipleChoiceDictionaryModelAttrs
> {
  type = CustomScreenComponentTypes.MultipleChoiceDictionary;

  getAttrs(attrs: CustomComponentAttr): MultipleChoiceDictionaryModelAttrs {
    return new MultipleChoiceDictionaryModelAttrs(attrs);
  }

  getSpecificValidators(): Function[] {
    return [isMultipleSelectedItemsValid];
  }
}
