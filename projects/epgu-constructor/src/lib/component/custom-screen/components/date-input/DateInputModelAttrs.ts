import { BrokenDateFixStrategy } from '@epgu/ui/models/common-enums';
import { CustomComponentAttr, DateRestriction } from '../../components-list.types';
import GenericAttrs from '../../component-list-resolver/GenericAttrs';

export default class DateInputModelAttrs  extends GenericAttrs  {
  readonly readonly: boolean;
  readonly minDate: string;
  readonly maxDate: string;
  readonly brokenDateFixStrategy: BrokenDateFixStrategy;
  readonly minDateRef: string;
  readonly maxDateRef: string;
  readonly dateRestrictions: DateRestriction[];
  readonly limit: string;
  readonly to: string;
  readonly from: string;

  constructor(attrs: CustomComponentAttr) {
    super(attrs);
    this.readonly = attrs.readonly;
    this.minDate = attrs.minDate;
    this.minDateRef = attrs.minDateRef;
    this.maxDate = attrs.maxDate;
    this.maxDateRef = attrs.maxDateRef;
    this.brokenDateFixStrategy = attrs.brokenDateFixStrategy;
    this.dateRestrictions = attrs.dateRestrictions;
    this.limit = attrs.limit;
    this.to = attrs.to;
    this.from = attrs.from;
  }
}
