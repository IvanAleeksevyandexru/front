import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { DatesToolsService } from '../../../../../../core/services/dates-tools/dates-tools.service';

interface ValidatorDate {
  dateVaidator: boolean
}

// TODO: подумать над мерджем этой логики с ValidationService
@Injectable()
export class DateValidator {

  constructor(
    public datesHelperService: DatesToolsService
  ) {}

  public date = (aControl: AbstractControl): ValidatorDate | null => {
    if (aControl && aControl.value && !this.datesHelperService.isValid(aControl.value)) {
      return { dateVaidator: true };
    }
    if (aControl && typeof aControl.value !== 'object') {
      return { dateVaidator: true };
    }
    return null;
  };
}
