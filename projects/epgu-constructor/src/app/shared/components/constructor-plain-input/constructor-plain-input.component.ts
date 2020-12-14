import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ValidationShowOn } from 'epgu-lib';
import { TextTransform } from '../../types/textTransform';
import { CustomComponent } from '../../../component/components-list/components-list.types';

@Component({
  selector: 'epgu-constructor-constructor-plain-input',
  templateUrl: './constructor-plain-input.component.html',
})
export class ConstructorPlainInputComponent {
  @Input() control: FormControl;
  @Input() validationShowOn: ValidationShowOn;
  @Input() textTransformType?: TextTransform;
  @Input() readOnly?: boolean;
  @Input() invalid?: boolean;
  @Input() name?: string;
  @Input() id?: string;
  @Input() placeholder?: string;
  @Input() price?: boolean;
  @Input() maxlength?: number;
  @Input() type?: string;
  @Input() pattern?: string;
  @Input() component?: CustomComponent;
  @Output() public blurEvent = new EventEmitter();

  onBlur(): void {
    this.blurEvent.emit();
  }
}
