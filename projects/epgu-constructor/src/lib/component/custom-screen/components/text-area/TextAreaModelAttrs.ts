import { CustomComponentAttr } from '../../components-list.types';
import GenericAttrs from '../../component-list-resolver/GenericAttrs';

export default class TextAreaModelAttrs extends GenericAttrs {
  readonly charsAmount: number;
  readonly readonly: boolean;

  constructor(attrs: CustomComponentAttr) {
    super(attrs);
    this.charsAmount = attrs.charsAmount;
    this.readonly = attrs.readonly;
  }

}
