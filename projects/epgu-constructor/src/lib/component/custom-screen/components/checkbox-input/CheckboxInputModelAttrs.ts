import { CustomComponentAttr } from '../../components-list.types';
import GenericAttrs from '../../component-list-resolver/GenericAttrs';
import { Clarifications } from '@epgu/epgu-constructor-types';

export default class CheckboxInputModelAttrs extends GenericAttrs {
  readonly isHorizontal: boolean;

  readonly hint: string;

  readonly clarifications: Clarifications;

  constructor(attrs: CustomComponentAttr) {
    super(attrs);
    this.isHorizontal = attrs.isHorizontal;
    this.clarifications = attrs.clarifications;
    this.hint = attrs.hint;
  }
}
