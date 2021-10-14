import { CustomComponentAttr, SupportedValue } from '../../components-list.types';
import GenericAttrs from '../../component-list-resolver/GenericAttrs';

export default class RadioInputModelAttrs extends GenericAttrs {
  readonly hidden: boolean;
  readonly isHorizontal: boolean;
  readonly supportedValues: SupportedValue[];

  constructor(attrs: CustomComponentAttr) {
    super(attrs);
    this.hidden = attrs.hidden;
    this.isHorizontal = attrs.isHorizontal;
    this.supportedValues = attrs.supportedValues;
  }

}
