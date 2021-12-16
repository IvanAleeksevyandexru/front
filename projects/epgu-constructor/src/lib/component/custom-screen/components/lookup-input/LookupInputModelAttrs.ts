import { Clarifications, Hint } from '@epgu/epgu-constructor-types';
import {
  CustomComponentAttr,
  FocusOnInitAndStartSearch,
  QueryMinSymbolsCount,
  SearchIconForcedShowing,
} from '../../components-list.types';
import DictionarySharedAttrs from '../../component-list-resolver/DictionarySharedAttrs';

export default class LookupInputModelAttrs extends DictionarySharedAttrs {
  readonly searchIconForcedShowing: SearchIconForcedShowing;

  readonly hint: Hint;

  readonly queryMinSymbolsCount: QueryMinSymbolsCount;

  readonly focusOnInitAndStartSearch: FocusOnInitAndStartSearch;

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
