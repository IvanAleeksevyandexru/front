import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Clarifications, TextTransform } from '@epgu/epgu-constructor-types';
import { Width } from '@epgu/ui/models';
import { ValidationShowOn } from '@epgu/ui/models/common-enums';
import { CustomComponent } from '../../../component/custom-screen/components-list.types';

@Component({
  selector: 'epgu-constructor-constructor-multiline-input',
  templateUrl: './constructor-multiline-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConstructorMultilineInputComponent {
  @Input() control: FormControl;
  @Input() textTransformType?: TextTransform;
  @Input() name?: string;
  @Input() type?: string;
  @Input() pattern?: string;
  @Input() component?: CustomComponent;

  @Input() public contextClass?: string; // класс-маркер разметки для deep стилей
  @Input() public id?: string;
  @Input() public placeholder?: string;
  @Input() public tabIndex?: string | number;
  @Input() public readOnly?: boolean;
  @Input() public disabled?: boolean;
  @Input() public maxlength: number;
  @Input() public commitOnInput = true; // коммитить ли значение по input или по change
  @Input() public invalid = false;
  @Input() public validationShowOn: ValidationShowOn = ValidationShowOn.TOUCHED;
  @Input() public fullHeightScroll = true;
  @Input() public width?: Width | string;
  @Input() public stringsAmount?: number;
  @Input() public clarifications?: Clarifications;
}
