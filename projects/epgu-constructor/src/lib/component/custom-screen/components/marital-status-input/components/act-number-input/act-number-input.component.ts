import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ValidationShowOn } from '@epgu/ui/models/common-enums';
import { AbstractControl } from '@angular/forms';
import { ComponentAttrsDto } from '@epgu/epgu-constructor-types';
import { MaritalStatusInputFieldsTypes } from '../../marital-status-input.types';

@Component({
  selector: 'epgu-constructor-act-number-input',
  templateUrl: './act-number-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActNumberInputComponent {
  @Input() label: string;
  @Input() attrs: ComponentAttrsDto;
  @Input() hint?: string;
  @Input() placeholder?: string;
  @Input() control: AbstractControl;
  @Input() validationShowOn: ValidationShowOn;

  public FieldsTypes = MaritalStatusInputFieldsTypes;

  public markControlAsDirty(): void {
    this.control.markAsDirty();
    this.control.updateValueAndValidity();
  }
}
