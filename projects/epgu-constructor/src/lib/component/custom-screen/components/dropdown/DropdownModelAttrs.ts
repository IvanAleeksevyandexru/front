import DictionarySharedAttrs from '../../component-list-resolver/DictionarySharedAttrs';
import { CustomComponentAttr } from '../../components-list.types';

export default class DropdownModelAttrs extends DictionarySharedAttrs {
  readonly localSearch: boolean;
  readonly isNotDuplicate: boolean;

  constructor(attrs: CustomComponentAttr) {
    super(attrs);
    this.localSearch = attrs.localSearch;
    this.isNotDuplicate = attrs.isNotDuplicate;
  }
}
