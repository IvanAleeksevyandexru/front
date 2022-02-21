import { CustomComponentAttr } from '../../components-list.types';
import GenericAttrs from '../../component-list-resolver/GenericAttrs';
import { Clarifications } from '@epgu/epgu-constructor-types';

export default class TextAreaModelAttrs extends GenericAttrs {
  readonly charsAmount: number;

  readonly readonly: boolean;

  readonly labelHint?: string;

  readonly hint?: string;

  readonly customUnrecLabel: string;

  readonly clarifications: Clarifications;

  constructor(attrs: CustomComponentAttr) {
    super(attrs);
    this.customUnrecLabel = attrs.customUnrecLabel;
    this.charsAmount = attrs.charsAmount;
    this.readonly = attrs.readonly;
    this.labelHint = attrs.labelHint;
    this.hint = attrs.hint;
    this.clarifications = attrs.clarifications;
  }
}
