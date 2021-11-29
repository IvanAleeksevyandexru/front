import { ConfirmUserDataStyle, FieldGroup } from '@epgu/epgu-constructor-types';
import { CustomComponentAttr } from '../../components-list.types';
import GenericAttrs from '../../component-list-resolver/GenericAttrs';
import { Clarifications } from '@epgu/epgu-constructor-types';

export default class FieldListModelAttrs extends GenericAttrs  {
  readonly fieldGroups: FieldGroup[];
  readonly style: ConfirmUserDataStyle;
  readonly clarifications?: Clarifications;

  constructor(attrs: CustomComponentAttr) {
    super(attrs);
    this.fieldGroups = attrs.fieldGroups;
    this.style = attrs.style;
    this.clarifications = attrs?.clarifications;
  }
}
