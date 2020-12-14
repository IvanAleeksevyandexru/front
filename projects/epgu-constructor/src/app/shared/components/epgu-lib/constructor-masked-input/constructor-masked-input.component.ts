import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ValidationShowOn } from 'epgu-lib';

import { TextTransform } from '../../../types/textTransform';
import { CustomComponent } from '../../../../component/components-list/components-list.types';

@Component({
  selector: 'epgu-constructor-masked-input',
  templateUrl: './constructor-masked-input.component.html',
})
export class ConstructorMaskedInputComponent {
  @Input() control: FormControl;
  @Input() validationShowOn: ValidationShowOn;
  @Input() textTransformType: TextTransform;
  @Input() readonly: boolean;
  @Input() showConstantMaskSymbols: boolean;
  @Input() showMaskAsPlaceholder: boolean;
  @Input() clearable: boolean;
  @Input() invalid: boolean;
  @Input() mask: Array<string> | Array<string | RegExp>;
  @Input() name: string;
  @Input() id: string;
  @Input() placeholder: string;
  @Input() isTrim?: boolean;
  @Input() component?: CustomComponent;

  public onChange($event: Event): void {
    if (this.control.updateOn === 'blur') {
      const input = $event.target as HTMLInputElement;
      this.control.setValue(input.value);
      this.control.updateValueAndValidity();
    }
  }
}
