import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ValidationShowOn } from 'epgu-lib';
import { CustomComponent } from '../../../component/shared/components/components-list/components-list.types';
import { TextTransform } from '../../types/textTransform';

@Component({
  selector: 'epgu-constructor-constructor-plain-input',
  templateUrl: './constructor-plain-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  @Input() rank?: boolean;
  @Input() maxlength?: number;
  @Input() type?: string;
  @Input() pattern?: string;
  @Input() component?: CustomComponent;
}
