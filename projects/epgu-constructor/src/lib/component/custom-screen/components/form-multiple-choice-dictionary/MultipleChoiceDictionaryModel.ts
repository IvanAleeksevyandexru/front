import BaseModel from '../../component-list-resolver/BaseModel';
import { CustomComponentAttr, CustomScreenComponentTypes } from '../../components-list.types';
import MultipleChoiceDictionaryModelAttrs from './MultipleChoiceDictionaryModelAttrs';
import { isMultipleSelectedItemsValid } from './MultipleChoiceDictionaryValidations';

export default class MultipleChoiceDictionaryModel extends BaseModel<
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
