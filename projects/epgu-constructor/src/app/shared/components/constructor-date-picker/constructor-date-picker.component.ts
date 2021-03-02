import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Align, BrokenDateFixStrategy, RelativeDate } from 'epgu-lib';
import { ValidationShowOn } from 'epgu-lib/lib/models/validation-show';

@Component({
  selector: 'epgu-constructor-constructor-date-picker',
  templateUrl: './constructor-date-picker.component.html',
  changeDetection: ChangeDetectionStrategy.Default, // @todo поменять на OnPush
})
export class ConstructorDatePickerComponent {
  @Input() invalid: boolean;
  @Input() validationShowOn: ValidationShowOn | string | boolean;
  @Input() name: string;
  @Input() control: AbstractControl;
  @Input() readOnly: boolean;
  @Input() minDate: Date | RelativeDate | string;
  @Input() maxDate: Date | RelativeDate | string;
  @Input() clearable: boolean;
  @Input() align: Align | string;
  @Input() disabled: boolean;
  @Input() brokenDateFixStrategy?: BrokenDateFixStrategy;

  @Output() dateSelectedEvent = new EventEmitter<Date>();
  @Output() clearedEvent = new EventEmitter<void>();
  @Output() blurEvent = new EventEmitter<void>();

  public onDateSelected(date: Date): void {
    this.dateSelectedEvent.emit(date);
  }

  public onCleared(): void {
    this.clearedEvent.emit();
  }

  public onBlur(): void {
    this.blurEvent.emit();
  }

  public onChange($event: Event): void {
    const input = $event.target as HTMLInputElement;
    const [day, month, year] = input.value.split('.').map((date) => parseInt(date, 10));

    const date = new Date(year, month - 1, day);
    this.onDateSelected(date);
  }
}
