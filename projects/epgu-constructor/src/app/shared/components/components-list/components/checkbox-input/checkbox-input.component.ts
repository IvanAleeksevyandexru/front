import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'epgu-constructor-checkbox-input',
  templateUrl: './checkbox-input.component.html',
  styleUrls: ['../../components-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default, // @todo поменять на OnPush
})
export class CheckboxInputComponent {
  @Input() control: FormGroup | AbstractControl;
  @Input() groupIndex = 0;
}
