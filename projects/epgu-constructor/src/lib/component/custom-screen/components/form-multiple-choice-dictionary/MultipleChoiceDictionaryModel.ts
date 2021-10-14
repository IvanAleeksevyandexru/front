import BaseModel from '../../component-list-resolver/BaseModel';
import { CustomComponentAttr, CustomScreenComponentTypes } from '../../components-list.types';
import MultipleChoiceDictionaryModelAttrs from './MultipleChoiceDictionaryModelAttrs';

export default class MultipleChoiceDictionaryModel extends BaseModel<MultipleChoiceDictionaryModelAttrs> {
  type = CustomScreenComponentTypes.MultipleChoiceDictionary;

  getAttrs(attrs: CustomComponentAttr): MultipleChoiceDictionaryModelAttrs {
    return new MultipleChoiceDictionaryModelAttrs(attrs);
  }
}
