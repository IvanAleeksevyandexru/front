import { CustomComponentAttr } from '../../components-list.types';
import GenericAttrs from '../../component-list-resolver/GenericAttrs';
import { Clarifications } from '@epgu/epgu-constructor-types';

export default class CheckboxInputModelAttrs extends GenericAttrs {
  readonly hint: string;

  readonly clarifications: Clarifications;

  readonly isSoloCheckBox: boolean;

  constructor(attrs: CustomComponentAttr) {
    super(attrs);
    this.clarifications = attrs.clarifications;
    this.hint = attrs.hint;
    this.isSoloCheckBox = attrs.isSoloCheckBox;
  }
}
