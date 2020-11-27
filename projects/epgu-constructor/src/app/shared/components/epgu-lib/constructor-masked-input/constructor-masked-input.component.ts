import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ValidationShowOn } from 'epgu-lib';
import { TextTransform } from '../../../types/textTransform';

@Component({
  selector: 'epgu-constructor-masked-input',
  templateUrl: './constructor-masked-input.component.html',
  styleUrls: ['./constructor-masked-input.component.scss'],
})
export class ConstructorMaskedInputComponent {
  @Input() control: FormControl;
  @Input() controlName: string;
  @Input() validationShowOn: ValidationShowOn;
  @Input() textTransformType: TextTransform;
  @Input() readonly: boolean;
  @Input() showConstantMaskSymbols: boolean;
  @Input() showMaskAsPlaceholder: boolean;
  @Input() clearable: boolean;
  @Input() invalid: boolean;
  @Input() mask: Array<string>;
  @Input() name: string;
  @Input() id: string;
  @Input() placeholder: string;
}
