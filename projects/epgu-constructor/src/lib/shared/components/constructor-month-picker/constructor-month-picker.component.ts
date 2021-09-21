import {
  AfterContentChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Align, ValidationShowOn } from '@epgu/ui/models/common-enums';
import { MonthYear } from '@epgu/ui/models/date-time';

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
  @Output() changeEvent = new EventEmitter();
  @Output() clearedEvent = new EventEmitter<void>();
  @Output() focusEvent = new EventEmitter();
  @Output() blurEvent = new EventEmitter();

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterContentChecked(): void {
    // TODO убрать. Узнать почему календарь странно себя ведет (при первом открытии год устанавливается на минимальный)
    this.cdr.detectChanges();
  }
}
