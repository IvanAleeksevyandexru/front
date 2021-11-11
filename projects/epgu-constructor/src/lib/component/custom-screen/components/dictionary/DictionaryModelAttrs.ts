import DictionarySharedAttrs from '../../component-list-resolver/DictionarySharedAttrs';
import { CustomComponentAttr } from '../../components-list.types';

export default class DictionaryModelAttrs extends DictionarySharedAttrs {
  readonly localSearch: boolean;

  constructor(attrs: CustomComponentAttr) {
    super(attrs);
    this.localSearch = attrs.localSearch;
  }
}
