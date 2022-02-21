import {
  Hint,
  Clarifications,
  CustomUnrecLabel,
  DisplaySubjHead,
} from '@epgu/epgu-constructor-types';
import {
  CustomComponentAttr,
  FocusOnInitAndStartSearch,
  QueryMinSymbolsCount,
  SearchIconForcedShowing,
} from '../../components-list.types';
import DictionarySharedAttrs from '../../component-list-resolver/DictionarySharedAttrs';

export default class SelectFromListModelAttrs extends DictionarySharedAttrs {
  readonly searchIconForcedShowing: SearchIconForcedShowing;

  readonly hint: Hint;

  readonly queryMinSymbolsCount: QueryMinSymbolsCount;

  readonly focusOnInitAndStartSearch: FocusOnInitAndStartSearch;

  readonly clarifications: Clarifications;

  readonly customUnrecLabel: CustomUnrecLabel;

  readonly label: string;

  readonly description: DisplaySubjHead;

  readonly listIncrementLength: number;

  readonly listInitLength: number;

  constructor(attrs: CustomComponentAttr) {
    super(attrs);
    this.searchIconForcedShowing = attrs.searchIconForcedShowing;
    this.hint = attrs.hint;
    this.queryMinSymbolsCount = attrs.queryMinSymbolsCount;
    this.focusOnInitAndStartSearch = attrs.focusOnInitAndStartSearch;
    this.clarifications = attrs.clarifications;
    this.customUnrecLabel = attrs.customUnrecLabel;
    this.label = attrs.label;
    this.description = (attrs.description as unknown) as DisplaySubjHead;
    this.listIncrementLength = attrs.listIncrementLength;
    this.listInitLength = attrs.listInitLength;
  }
}
