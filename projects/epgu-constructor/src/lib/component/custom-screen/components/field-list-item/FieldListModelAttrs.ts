import { ConfirmUserDataStyle, FieldGroup } from '@epgu/epgu-constructor-types';
import { CustomComponentAttr } from '../../components-list.types';
import GenericAttrs from '../../component-list-resolver/GenericAttrs';

export default class FieldListModelAttrs extends GenericAttrs  {
  readonly fieldGroups: FieldGroup[];
  readonly style: ConfirmUserDataStyle;

  constructor(attrs: CustomComponentAttr) {
    super(attrs);
    this.fieldGroups = attrs.fieldGroups;
    this.style = attrs.style;
  }
}
