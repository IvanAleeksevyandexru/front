import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'epgu-constructor-constructor-checkbox',
  templateUrl: './constructor-checkbox.component.html',
})
export class ConstructorCheckboxComponent {
  @Input() checkboxId: string;
  @Input() control: AbstractControl;
  @Input() labelText: string;
  @Input() required: boolean;
}
