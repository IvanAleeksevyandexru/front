import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ValidationShowOn } from 'epgu-lib';

import { TextTransform } from '../../types/textTransform';

@Component({
  selector: 'epgu-constructor-constructor-plain-input',
  templateUrl: './constructor-plain-input.component.html',
  styleUrls: ['./constructor-plain-input.component.scss'],
})
export class ConstructorPlainInputComponent {
  @Input() control: FormControl;
  @Input() validationShowOn: ValidationShowOn;
  @Input() textTransformType: TextTransform;
  @Input() readonly: boolean;
  @Input() invalid: boolean;
  @Input() name: string;
  @Input() id: string;
  @Input() placeholder: string;
  @Input() price: boolean;
}
