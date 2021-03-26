import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'epgu-constructor-constructor-checkbox',
  templateUrl: './constructor-checkbox.component.html',
  styleUrls: ['./constructor-checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default, // @todo поменять на OnPush
})
export class ConstructorCheckboxComponent {
  @Input() checkboxId: string;
  @Input() control: AbstractControl;
  @Input() labelText: string;
  @Input() required: boolean;
  @Input() hidden: boolean;
}
