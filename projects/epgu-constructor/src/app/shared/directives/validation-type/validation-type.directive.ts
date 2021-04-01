import { Directive, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';
import { CustomComponent } from '../../../component/custom-screen/components-list.types';
import { EventBusService } from '../../../core/services/event-bus/event-bus.service';
import { ValidationService } from '../../services/validation/validation.service';

@Directive({
  selector: '[epgu-constructor-validation-type]',
})
export class ValidationTypeDirective {
  @Input() component?: CustomComponent;

  constructor(private validationService: ValidationService, private control: NgControl, private eventBusService: EventBusService) {}

  @HostListener('blur')
  blur(): void {
    if (this.component?.attrs?.validation) {
      this.validateOnBlur();
    }
  }

  private validateOnBlur(): void {
    const onBlurValidatorFns = this.validationService.customAsyncValidator(this.component, 'blur');
    this.control.control.setAsyncValidators(onBlurValidatorFns);
    this.control.control.updateValueAndValidity();
    this.control.control.clearAsyncValidators();
    this.eventBusService.emit('validateOnBlur');
  }
}
