import { CustomComponentAttr } from '../../components-list.types';
import GenericAttrs from '../../component-list-resolver/GenericAttrs';

export default class TextAreaModelAttrs extends GenericAttrs {
  readonly charsAmount: number;

  readonly readonly: boolean;

  readonly labelHint?: string;

  constructor(attrs: CustomComponentAttr) {
    super(attrs);
    this.charsAmount = attrs.charsAmount;
    this.readonly = attrs.readonly;
    this.labelHint = attrs.labelHint;
  }
}
