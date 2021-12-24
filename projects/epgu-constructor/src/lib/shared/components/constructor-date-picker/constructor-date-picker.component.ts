import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Align, BrokenDateFixStrategy, ValidationShowOn } from '@epgu/ui/models/common-enums';
import { DatesHelperService } from '@epgu/ui/services/dates-helper';
import { RelativeDate } from '@epgu/ui/models/date-time';
import { CustomComponent } from '../../../component/custom-screen/components-list.types';

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
  @Input() component: CustomComponent;
  @Input() readOnly: boolean;
  @Input() minDate: Date | RelativeDate | string;
  @Input() maxDate: Date | RelativeDate | string;
  @Input() clearable: boolean;
  @Input() align: Align | string;
  @Input() disabled: boolean;
  @Input() brokenDateFixStrategy?: BrokenDateFixStrategy = BrokenDateFixStrategy.RESET;
  @Input() textModelValue: boolean;

  @Output() dateSelectedEvent = new EventEmitter<Date>();
  @Output() clearedEvent = new EventEmitter<void>();
  @Output() blurEvent = new EventEmitter<void>();

  public onDateSelected(date: Date): void {
    this.control.patchValue(date);
    this.control.updateValueAndValidity();
    this.dateSelectedEvent.emit(date);
  }

  public onCleared(): void {
    this.clearedEvent.emit();
  }

  public onBlur(): void {
    this.control.setValue(this.control.value);
    this.control.updateValueAndValidity();
    this.blurEvent.emit();
  }

  public onChange($event: Event): void {
    const input = $event.target as HTMLInputElement;
    const [day, month, year] = this.getDateTuple(input.value);

    const date = (day && month && year && new Date(year, month - 1, day)) || null;
    this.onDateSelected(date);
  }

  public onInput($event: Event): void {
    const input = $event.target as HTMLInputElement;
    const [day, month, year] = this.getDateTuple(input.value);

    if (
      !Number.isNaN(day) &&
      !Number.isNaN(month) &&
      !Number.isNaN(year) &&
      year.toString().length === 4
    ) {
      const date = new Date(year, month - 1, day);

      if (!this.isDateInRange(date)) {
        this.control.updateValueAndValidity();
      } else {
        this.onDateSelected(date);
      }
    }
  }

  private getDateTuple(date: string): number[] {
    return date.split('.').map((num) => parseInt(num, 10));
  }

  private isDateInRange(date: Date): boolean {
    const minDate = DatesHelperService.relativeOrFixedToFixed(this.minDate);
    const maxDate = DatesHelperService.relativeOrFixedToFixed(this.maxDate);
    return DatesHelperService.isBetween(date, minDate, maxDate);
  }
}
