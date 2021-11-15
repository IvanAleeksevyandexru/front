import { CustomComponentAttr } from '../../components-list.types';
import DictionarySharedAttrs from '../../component-list-resolver/DictionarySharedAttrs';
import { Clarifications } from '@epgu/epgu-constructor-types';

export default class LookupInputModelAttrs extends DictionarySharedAttrs {
  readonly searchIconForcedShowing: boolean;
  readonly hint: string;
  readonly queryMinSymbolsCount: number;
  readonly focusOnInitAndStartSearch: boolean;
  readonly clarifications: Clarifications;

  constructor(attrs: CustomComponentAttr) {
    super(attrs);
    this.searchIconForcedShowing = attrs.searchIconForcedShowing;
    this.hint = attrs.hint;
    this.queryMinSymbolsCount = attrs.queryMinSymbolsCount;
    this.focusOnInitAndStartSearch = attrs.focusOnInitAndStartSearch;
    this.clarifications = attrs.clarifications;
  }

}
