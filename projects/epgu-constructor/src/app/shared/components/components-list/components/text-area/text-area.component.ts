import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ValidationShowOn } from 'epgu-lib';
import { AbstractControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'epgu-constructor-text-area',
  templateUrl: './text-area.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextAreaComponent {
  @Input() control: FormGroup | AbstractControl;
  @Input() validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
}
