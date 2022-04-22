import { CustomComponentAttr } from '../../components-list.types';
import GenericAttrs from '../../component-list-resolver/GenericAttrs';
import { Clarifications } from '@epgu/epgu-constructor-types';

export default class CheckboxInputModelAttrs extends GenericAttrs {
  readonly hint: string;

  readonly clarifications: Clarifications;

  readonly isSoloCheckBox: boolean;

  //todo: заменить на тип BooleanStr
  readonly consistInRadioButton: 'true' | 'false';

  constructor(attrs: CustomComponentAttr) {
    super(attrs);
    this.clarifications = attrs.clarifications;
    this.hint = attrs.hint;
    this.isSoloCheckBox = attrs.isSoloCheckBox;
    this.consistInRadioButton = attrs.consistInRadioButton;
  }
}
