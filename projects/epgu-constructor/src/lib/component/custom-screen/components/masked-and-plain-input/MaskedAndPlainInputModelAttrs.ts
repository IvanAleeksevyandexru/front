import {
  TextTransform
} from '@epgu/epgu-constructor-types';
import { CustomComponentAttr } from '../../components-list.types';
import GenericAttrs from '../../component-list-resolver/GenericAttrs';

export default class MaskedAndPlainInputModelAttrs extends GenericAttrs {
  readonly hidden: boolean;
  readonly mask: string[];
  readonly price: number;
  readonly fstuc: TextTransform;
  readonly readonly: boolean;
  readonly maskOptions: unknown;
  readonly showMaskSymbols: boolean;
  readonly showPlaceholderOnFocus: boolean;
  readonly hint: string;

  constructor(attrs: CustomComponentAttr) {
    super(attrs);
    this.hidden = attrs.hidden;
    this.mask = attrs.mask;
    this.price = attrs.price;
    this.fstuc = attrs.fstuc;
    this.readonly = attrs.readonly;
    this.maskOptions = attrs.maskOptions;
    this.showMaskSymbols = attrs.showMaskSymbols;
    this.showPlaceholderOnFocus = attrs.showPlaceholderOnFocus;
    this.hint = attrs.hint;
  }

}
