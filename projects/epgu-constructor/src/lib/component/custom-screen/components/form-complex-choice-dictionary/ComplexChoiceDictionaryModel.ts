import BaseModel from '../../component-list-resolver/BaseModel';
import { CustomComponentAttr, CustomScreenComponentTypes } from '../../components-list.types';
import ComplexChoiceDictionaryModelAttrs from './ComplexChoiceDictionaryModelAttrs';

export default class ComplexChoiceDictionaryModel extends BaseModel<ComplexChoiceDictionaryModelAttrs> {
  type = CustomScreenComponentTypes.ComplexChoiceDictionary;

  getAttrs(attrs: CustomComponentAttr): ComplexChoiceDictionaryModelAttrs {
    return new ComplexChoiceDictionaryModelAttrs(attrs);
  }
}
