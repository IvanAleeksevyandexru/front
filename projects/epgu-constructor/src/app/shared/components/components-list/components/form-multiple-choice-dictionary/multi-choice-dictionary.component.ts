import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'epgu-constructor-multi-choice-dictionary',
  templateUrl: './multi-choice-dictionary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiChoiceDictionaryComponent {
  @Input() control: FormGroup | AbstractControl;
}
