import { CustomComponentAttr, SupportedValue } from '../../components-list.types';
import GenericAttrs from '../../component-list-resolver/GenericAttrs';

export default class RadioInputModelAttrs extends GenericAttrs {
  readonly hidden: boolean;

  readonly isHorizontal: boolean;

  readonly supportedValues: SupportedValue[];

  readonly hint: string;

  readonly subLabel: string;

  readonly isTextHelper: boolean;

  readonly largeFontSize: boolean;

  constructor(attrs: CustomComponentAttr) {
    super(attrs);
    this.hidden = attrs.hidden;
    this.isHorizontal = attrs.isHorizontal;
    this.supportedValues = attrs.supportedValues;
    this.hint = attrs.hint;
    this.subLabel = attrs.subLabel;
    this.isTextHelper = attrs.isTextHelper;
    this.largeFontSize = attrs.largeFontSize;
  }
}
