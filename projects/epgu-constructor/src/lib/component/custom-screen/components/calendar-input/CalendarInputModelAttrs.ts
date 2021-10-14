import { CustomComponent, CustomComponentAttr, DateRestriction } from '../../components-list.types';
import GenericAttrs from '../../component-list-resolver/GenericAttrs';

export default class CalendarInputModelAttrs extends GenericAttrs {
  readonly components: CustomComponent[];
  readonly dateRestrictions: DateRestriction[];

  constructor(attrs: CustomComponentAttr) {
    super(attrs);
    this.dateRestrictions = attrs.dateRestrictions;
    this.components = attrs.components as CustomComponent[];
  }
}
