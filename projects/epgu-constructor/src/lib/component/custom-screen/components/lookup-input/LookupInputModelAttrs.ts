import { CustomComponentAttr } from '../../components-list.types';
import DictionarySharedAttrs from '../../component-list-resolver/DictionarySharedAttrs';

export default class LookupInputModelAttrs extends DictionarySharedAttrs {
  readonly searchIconForcedShowing: boolean;
  readonly hint: string;
  readonly queryMinSymbolsCount: number;
  readonly focusOnInitAndStartSearch: boolean;

  constructor(attrs: CustomComponentAttr) {
    super(attrs);
    this.searchIconForcedShowing = attrs.searchIconForcedShowing;
    this.hint = attrs.hint;
    this.queryMinSymbolsCount = attrs.queryMinSymbolsCount;
    this.focusOnInitAndStartSearch = attrs.focusOnInitAndStartSearch;
  }

}
