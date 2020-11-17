import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { OPTIONAL_FIELD, SPECIAL_OPTIONAL_FIELD } from '../../../shared/constants/helper-texts';
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

  readonly optionalField = OPTIONAL_FIELD;
  readonly componentType = CustomScreenComponentTypes;

  optionalText() {
    return this.data.value?.label?.toLowerCase() === 'отчество'
      ? SPECIAL_OPTIONAL_FIELD
      : OPTIONAL_FIELD;
  }
}
