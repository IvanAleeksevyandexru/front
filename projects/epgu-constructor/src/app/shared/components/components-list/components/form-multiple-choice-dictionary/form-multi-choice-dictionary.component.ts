import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'epgu-constructor-form-multi-choice-dictionary',
  templateUrl: './form-multi-choice-dictionary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormMultiChoiceDictionaryComponent {
  @Input() control: FormGroup | AbstractControl;
}
