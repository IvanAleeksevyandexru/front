import {
  BooleanStr,
  Clarifications,
  DisabledByCheckbox,
  TextTransform,
} from '@epgu/epgu-constructor-types';
import { CustomComponentAttr } from '../../components-list.types';
import GenericAttrs from '../../component-list-resolver/GenericAttrs';

export default class MaskedAndPlainInputModelAttrs extends GenericAttrs {
  readonly customUnrecLabel: string;

  readonly hidden: boolean;

  readonly mask: string[];

  readonly price: number;

  readonly fstuc: TextTransform;

  readonly readonly: boolean | BooleanStr;

  readonly maskOptions: unknown;

  readonly showMaskSymbols: boolean;

  readonly showPlaceholderOnFocus: boolean;

  readonly hint: string;

  readonly clarifications: Clarifications;

  readonly disabledByCheckbox: DisabledByCheckbox;

  readonly rank: boolean;

  readonly suggestionPath: string;

  constructor(attrs: CustomComponentAttr) {
    super(attrs);
    this.customUnrecLabel = attrs.customUnrecLabel;
    this.hidden = attrs.hidden;
    this.mask = attrs.mask;
    this.price = attrs.price;
    this.fstuc = attrs.fstuc;
    this.readonly = attrs.readonly;
    this.maskOptions = attrs.maskOptions;
    this.showMaskSymbols = attrs.showMaskSymbols;
    this.showPlaceholderOnFocus = attrs.showPlaceholderOnFocus;
    this.suggestionPath = attrs.suggestionPath;
    this.hint = attrs.hint;
    this.clarifications = attrs.clarifications;
    this.disabledByCheckbox = attrs.disabledByCheckbox;
    this.rank = attrs.rank;
  }
}
