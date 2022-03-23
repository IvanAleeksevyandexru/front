import {
  CustomComponent,
  CustomComponentAttr,
  CustomComponentValidationConditions,
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

  hasAtLeastOne(component: CustomComponent): boolean {
    return !!component?.attrs?.validation?.find(
      (v) => v.condition === CustomComponentValidationConditions.atLeastOne,
    );
  }

  getSpecificValidators(): Function[] {
    return [isMultipleSelectedItemsValid];
  }
}
