import { Directive, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';
import { BusEventType, EventBusService } from '@epgu/epgu-constructor-ui-kit';
import { CustomComponent, UpdateOn } from '../../../component/custom-screen/components-list.types';
import { ValidationService } from '../../services/validation/validation.service';

@Directive({
  selector: '[epgu-constructor-validation-type]',
})
export class ValidationTypeDirective {
  @Input() component?: CustomComponent;

  constructor(
    private validationService: ValidationService,
    private control: NgControl,
    private eventBusService: EventBusService,
  ) {}

  @HostListener('blur')
  blur(): void {
    const validations = this.component?.attrs?.validation;

    if (validations) {
      const isOnBlur = validations.filter((validation) => validation.updateOn === UpdateOn.ON_BLUR);

      if (isOnBlur.length > 0) {
        this.validateOnBlur();
      }
    }
  }

  private validateOnBlur(): void {
    const onBlurValidatorFns = this.validationService.customAsyncValidator(
      this.component,
      UpdateOn.ON_BLUR,
    );
    this.control.control.setAsyncValidators(onBlurValidatorFns);
    this.control.control.updateValueAndValidity();
    this.control.control.clearAsyncValidators();
    this.eventBusService.emit(BusEventType.ValidateOnBlur);
  }
}
