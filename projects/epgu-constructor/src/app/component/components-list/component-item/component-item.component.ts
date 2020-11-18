import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { OPTIONAL_FIELD } from '../../../shared/constants/helper-texts';
import { CustomScreenComponentTypes } from '../components-list.types';

@Component({
  selector: 'epgu-constructor-component-item',
  templateUrl: './component-item.component.html',
  styleUrls: ['./component-item.component.scss'],
})
export class ComponentItemComponent {
  @Input() data: AbstractControl;

  @Input() disableLabel = false;
  @Input() disableError = false;
  @Input() disableHint = false;

  readonly componentType = CustomScreenComponentTypes;

  customUnRecLabel() {
    return this.data.value?.attrs?.customUnrecLabel
      ? this.data.value?.attrs?.customUnrecLabel
      : OPTIONAL_FIELD;
  }
}
