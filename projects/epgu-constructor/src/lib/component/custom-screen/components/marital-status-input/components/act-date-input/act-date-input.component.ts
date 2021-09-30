import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BrokenDateFixStrategy, ValidationShowOn } from '@epgu/ui/models/common-enums';
import { AbstractControl } from '@angular/forms';
import { ComponentAttrsDto } from '@epgu/epgu-constructor-types';
import { MaritalStatusInputFieldsTypes } from '../../marital-status-input.types';

@Component({
  selector: 'epgu-constructor-act-date-input',
  templateUrl: './act-date-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActDateInputComponent {
  @Input() label: string;
  @Input() attrs: ComponentAttrsDto;
  @Input() hint?: string;
  @Input() control: AbstractControl;
  @Input() brokenDateFixStrategy?: BrokenDateFixStrategy = BrokenDateFixStrategy.NONE;
  @Input() validationShowOn: ValidationShowOn | string | boolean;

  public FieldsTypes = MaritalStatusInputFieldsTypes;

  public markControlAsDirty(): void {
    this.control.markAsDirty();
    this.control.updateValueAndValidity();
  }
}
