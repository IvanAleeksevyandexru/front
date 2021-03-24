import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BrokenDateFixStrategy, ValidationShowOn } from 'epgu-lib';
import { AbstractControl, FormGroup } from '@angular/forms';
import { DateRangeService } from '../../../../services/date-range/date-range.service';
import { DateRangeAttrs } from '../../../../services/date-range/date-range.models';

@Component({
  selector: 'epgu-constructor-date-input',
  templateUrl: './date-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateInputComponent {
  @Input() control: FormGroup | AbstractControl;
  validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
  minDateDefault = '-120y';
  maxDateDefault = '+50y';
  clearable = true;
  align = 'left';

  strategy = BrokenDateFixStrategy;
  constructor(private dateRangeService: DateRangeService) {}

  clearDate(id: string, attrs: DateRangeAttrs): void {
    this.dateRangeService.clearDate(id, attrs);
  }
}
