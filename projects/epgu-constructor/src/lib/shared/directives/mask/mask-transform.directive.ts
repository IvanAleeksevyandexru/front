import { Directive, HostListener, Input } from '@angular/core';
import { MASKS, NumberMaskOptions } from '@epgu/epgu-constructor-ui-kit';
import { NgControl } from '@angular/forms';
import { MaskTransformService } from './mask-transform.service';

@Directive({
  selector: '[epgu-constructor-mask-transform]',
})
export class MaskTransformDirective {
  @Input('epgu-constructor-mask-transform') mask: string | string[];
  @Input() maskOptions?: Partial<NumberMaskOptions>;

  constructor(
      private ngControl: NgControl,
      private maskTransformService: MaskTransformService,
  ) {}

  @HostListener('change', ['$event.target'])
  onBlur(target: HTMLInputElement): void {
    if (this.mask === MASKS.NumberMaskInput) {
      target.value = this.maskTransformService.transformNumberMaskInput(target.value, this.maskOptions);
      this.ngControl.control.patchValue(target.value, { emitEvent: false });
      this.ngControl.control.updateValueAndValidity();
    }
  }

}
