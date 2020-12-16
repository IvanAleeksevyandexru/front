import { Directive, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { NgControl } from '@angular/forms';

import { CustomComponent } from '../../../component/components-list/components-list.types';
import { ValidationService } from '../../services/validation/validation.service';

@Directive({
  selector: '[epgu-constructor-validation-type]',
})
export class ValidationTypeDirective {
  @Input() component: CustomComponent;
  @Output() emmitChangesEvent = new EventEmitter<void>();

  constructor(private validationService: ValidationService, private control: NgControl) {}

  @HostListener('blur')
  blur(): void {
    if (this.component.attrs.validation) {
      this.validateOnBlur();
    }
  }

  private validateOnBlur(): void {
    const onBlurValidatorFns = this.validationService.customAsyncValidator(this.component, 'blur');
    this.control.control.setAsyncValidators(onBlurValidatorFns);
    this.control.control.updateValueAndValidity();
    this.control.control.clearAsyncValidators();
    this.emmitChangesEvent.emit();
  }
}
