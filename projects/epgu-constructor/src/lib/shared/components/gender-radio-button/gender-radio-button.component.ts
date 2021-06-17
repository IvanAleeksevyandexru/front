import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LoggerService } from '@epgu/epgu-constructor-ui-kit';

enum GenderOrder {
  male = 0,
  female = 1,
}

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenderRadioButtonComponent implements ControlValueAccessor {
  genders = [
    { name: 'male', label: 'Мальчик', value: 'M' },
    { name: 'female', label: 'Девочка', value: 'F' },
  ];

  onChange: Function;
  onTouched: Function;

  innerValue: string | number | boolean;

  constructor(private loggerService: LoggerService) {}

  writeValue(value: string | number | boolean): void {
    this.innerValue = value || GenderOrder.male;
  }

  registerOnChange(fn: Function): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onTouched = fn;
  }

  change(gender: { value: string }): void {
    this.innerValue = gender.value;
    if (this.onChange) {
      this.onChange(gender.value);
      this.onTouched(gender.value);
    } else {
      this.loggerService.error(['You should apply data binding']);
    }
  }
}
