import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ValidationShowOn } from 'epgu-lib/lib/models/validation-show';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'epgu-constructor-constructor-dadata-widget',
  templateUrl: './constructor-dadata-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConstructorDadataWidgetComponent {
  @Input() simpleMode: boolean;
  @Input() hideLevels?: string[];
  @Input() hideHouseCheckbox: boolean;
  @Input() externalApiUrl?: string;
  @Input() id: string;
  @Input() validationShowOn: ValidationShowOn | string | boolean;
  @Input() invalid: boolean;
  @Input() clearable: boolean;
  @Input() control: AbstractControl;
}
