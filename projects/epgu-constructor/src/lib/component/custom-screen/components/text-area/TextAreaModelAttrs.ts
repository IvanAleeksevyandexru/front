import { CustomComponentAttr } from '../../components-list.types';
import GenericAttrs from '../../component-list-resolver/GenericAttrs';

export default class TextAreaModelAttrs extends GenericAttrs {
  readonly charsAmount: number;

  readonly readonly: boolean;

  readonly labelHint?: string;

  readonly hint?: string;

  constructor(attrs: CustomComponentAttr) {
    super(attrs);
    this.charsAmount = attrs.charsAmount;
    this.readonly = attrs.readonly;
    this.labelHint = attrs.labelHint;
    this.hint = attrs.hint;
  }
}
