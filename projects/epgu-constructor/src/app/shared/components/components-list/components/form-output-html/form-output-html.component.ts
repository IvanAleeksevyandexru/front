import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { CustomScreenComponentTypes } from '../../components-list.types';

@Component({
  selector: 'epgu-constructor-form-output-html',
  templateUrl: './form-output-html.component.html',
  styleUrls: ['form-output-html.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormOutputHtmlComponent {
  @Input() control: FormGroup | AbstractControl;

  outputHtmlClass: Partial<Record<CustomScreenComponentTypes, string>> = {
    [CustomScreenComponentTypes.LabelSection]: 'label',
    [CustomScreenComponentTypes.HtmlString]: 'info__text',
  };
}
