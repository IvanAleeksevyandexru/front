import GenericAttrs from '../../component-list-resolver/GenericAttrs';
import { DateRestriction, CustomComponentAttr } from '../../components-list.types';

export default class DocInputModelAttrs extends GenericAttrs {
  readonly dateRestrictions: DateRestriction[];

  constructor(attrs: CustomComponentAttr) {
    super(attrs);
    this.dateRestrictions = attrs.dateRestrictions;
  }
}
