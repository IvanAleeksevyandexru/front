import { CustomComponentAttr } from '../../components-list.types';
import GenericAttrs from '../../component-list-resolver/GenericAttrs';

export default class MonthPickerModelAttrs extends GenericAttrs  {
  readonly years: number;
  readonly nonStop: boolean;
  readonly minDate: string;
  readonly maxDate: string;

  constructor(attrs: CustomComponentAttr) {
    super(attrs);
    this.years = attrs.years;
    this.nonStop = attrs.nonStop;
    this.minDate = attrs.minDate;
    this.maxDate = attrs.maxDate;
  }

}
