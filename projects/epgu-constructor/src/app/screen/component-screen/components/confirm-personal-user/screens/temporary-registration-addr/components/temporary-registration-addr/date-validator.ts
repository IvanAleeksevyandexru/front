import { AbstractControl } from '@angular/forms';
import * as moment_ from 'moment';

const moment = moment_;

export class DateValidator {
  static date(aControl: AbstractControl) {
    if (aControl && aControl.value && !moment(aControl.value).isValid()) {
      return { dateVaidator: true };
    }
    if (aControl && typeof aControl.value !== 'object') {
      return { dateVaidator: true };
    }
    return null;
  }
}
