import {
  AfterContentChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Align, MonthYear, ValidationShowOn } from 'epgu-lib';

@Component({
  selector: 'epgu-constructor-constructor-month-picker',
  templateUrl: './constructor-month-picker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConstructorMonthPickerComponent implements AfterContentChecked {
  @Input() id: string;
  @Input() control: AbstractControl;
  @Input() minMonth: MonthYear;
  @Input() maxMonth: MonthYear;
  @Input() invalid: boolean;
  @Input() validationShowOn: ValidationShowOn | string | boolean;
  @Input() hideTillNowAvailable?: boolean;
  @Input() align?: Align | string;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterContentChecked(): void {
    // TODO убрать. Узнать почему календарь странно себя ведет (при первом открытии год устанавливается на минимальный)
    this.cdr.detectChanges();
  }
}
