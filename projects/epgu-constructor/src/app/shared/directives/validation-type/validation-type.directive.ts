import { Directive, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

import { CustomComponent } from '../../../component/components-list/components-list.types';
import { ValidationService } from '../../services/validation/validation.service';

@Directive({
  selector: '[epgu-constructor-validation-type]',
})
export class ValidationTypeDirective {
  @Input() component: CustomComponent;
  @HostListener('blur')
  blur(): void {
    console.log(this.component);
    if (this.component.attrs.validation) {
      this.validateOnBlur();
    }
  }

  constructor(private validationService: ValidationService, private control: NgControl) {}

  private validateOnBlur(): void {
    const onBlurValidatorFns = this.validationService.customAsyncValidator(this.component, 'blur');
    this.control.control.setAsyncValidators(onBlurValidatorFns);
    this.control.control.updateValueAndValidity();
    this.control.control.clearAsyncValidators();
  }
}
