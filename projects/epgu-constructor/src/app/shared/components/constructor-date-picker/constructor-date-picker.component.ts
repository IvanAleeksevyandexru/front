import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Align, RelativeDate } from 'epgu-lib';
import { ValidationShowOn } from 'epgu-lib/lib/models/validation-show';

@Component({
  selector: 'epgu-constructor-constructor-date-picker',
  templateUrl: './constructor-date-picker.component.html',
  styleUrls: ['./constructor-date-picker.component.scss'],
})
export class ConstructorDatePickerComponent implements OnInit {
  @Input() invalid: boolean;
  @Input() validationShowOn: ValidationShowOn | string | boolean;
  @Input() name: string;
  @Input() control: AbstractControl;
  @Input() readOnly: boolean;
  @Input() minDate: Date | RelativeDate | string;
  @Input() maxDate: Date | RelativeDate | string;
  @Input() clearable: boolean;
  @Input() align: Align | string;

  @Output() dateSelectedEvent = new EventEmitter<Date>();
  @Output() clearedEvent = new EventEmitter<void>();

  ngOnInit(): void {}

  public dateSelected(date: Date): void {
    this.dateSelectedEvent.emit(date);
  }

  public cleared(): void {
    this.clearedEvent.emit();
  }
}
