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
  @Input() validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
  @Input() minDateDefault = '-120y';
  @Input() maxDateDefault = '+50y';
  @Input() clearable = true;
  @Input() align = 'left';

  strategy = BrokenDateFixStrategy;
  constructor(public dateRangeService: DateRangeService) {}

  clearDate(id: string, attrs: DateRangeAttrs): void {
    this.dateRangeService.clearDate(id, attrs);
  }
}
