import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'epgu-constructor-gender-radio-button',
  templateUrl: './gender-radio-button.component.html',
  styleUrls: ['./gender-radio-button.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      useExisting: forwardRef(() => GenderRadioButtonComponent),
      multi: true,
    },
  ],
})
export class GenderRadioButtonComponent implements ControlValueAccessor {
  @Input() name: string;
  @Input() value: string | number | boolean;
  @Input() label: string;
  @Input() type: 'male' | 'female';

  onChange: Function;
  onTouched: Function;

  innerValue: string | number | boolean;

  writeValue(value: string | number | boolean) {
    if (value !== this.innerValue) {
      this.innerValue = value;
    }
  }

  registerOnChange(fn: Function): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onTouched = fn;
  }

  change(value: string | number | boolean) {
    this.innerValue = value;
    this.onChange(value);
    this.onTouched(value);
  }
}
