import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ValidationShowOn } from 'epgu-lib';

import { CustomComponent } from '../../custom-screen.types';

@Component({
  selector: 'epgu-constructor-string-input',
  templateUrl: './string-input.component.html',
})
export class StringInputComponent {
  @Input() data: CustomComponent;
  @Input() invalid: boolean;
  @Input() value: string;
  @Input() validationShowOn: ValidationShowOn;
  @Input() maxlength?: number;
  @Input() errorMessage?: string;
  @Input() helperText: string;

  @Output() handleChangeEvent = new EventEmitter<Event>();

  onChange(event: Event) {
    this.handleChangeEvent.emit(event);
  }
}
