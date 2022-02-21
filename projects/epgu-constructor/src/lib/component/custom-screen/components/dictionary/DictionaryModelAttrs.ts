import DictionarySharedAttrs from '../../component-list-resolver/DictionarySharedAttrs';
import { CustomComponentAttr } from '../../components-list.types';

export default class DictionaryModelAttrs extends DictionarySharedAttrs {
  readonly localSearch: boolean;

  readonly isClearable: boolean;

  readonly defaultLabelList: string;

  constructor(attrs: CustomComponentAttr) {
    super(attrs);
    this.localSearch = attrs.localSearch;
    this.isClearable = attrs.isClearable;
    this.defaultLabelList = attrs.defaultLabelList;
  }
}
