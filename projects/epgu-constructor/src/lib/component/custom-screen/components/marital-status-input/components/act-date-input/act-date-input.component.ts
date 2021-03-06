import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BrokenDateFixStrategy, ValidationShowOn } from '@epgu/ui/models/common-enums';
import { AbstractControl } from '@angular/forms';
import { ComponentAttrsDto } from '@epgu/epgu-constructor-types';

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
  @Input() brokenDateFixStrategy?: BrokenDateFixStrategy = BrokenDateFixStrategy.RESTORE;
  @Input() validationShowOn: ValidationShowOn | string | boolean;
  @Input() id: string;

  public markControlAsDirty(): void {
    this.control.markAsDirty();
    this.control.updateValueAndValidity();
  }
}
