import { Directive, HostListener, Input } from '@angular/core';
import { MASKS, numberMaskDefaultOptions, NumberMaskOptions } from '@epgu/epgu-constructor-ui-kit';
import { NgControl } from '@angular/forms';
import { MaskTransformService } from '../../services/mask-transform/mask-transform.service';

@Directive({
  selector: '[epgu-constructor-decimal-round]',
})
export class DecimalRoundDirective {
  @Input('epgu-constructor-decimal-round') mask: string | string[];
  @Input() maskOptions?: Partial<NumberMaskOptions>;

  constructor(private ngControl: NgControl, private maskTransformService: MaskTransformService) {}

  @HostListener('paste', ['$event'])
  onPaste($event): void {
    if (!this.maskOptions?.allowDecimalRounding || this.mask !== MASKS.NumberMaskInput) {
      return;
    }

    $event.preventDefault();

    const target = $event.target as HTMLInputElement;
    const pastedData = $event.clipboardData.getData('text');

    target.value = this.maskTransformService.transformNumberMaskInput(
      pastedData,
      this.maskOptions,
    );
    this.ngControl.control.patchValue(target.value, { emitEvent: false });
    this.ngControl.control.updateValueAndValidity();
  }

  // Prevent adding extra symbol in decimal when rounding is enabled and limit has reached
  @HostListener('keydown', ['$event'])
  onKeyDown($event: KeyboardEvent): void {
    if (!this.maskOptions?.allowDecimalRounding || this.mask !== MASKS.NumberMaskInput) {
      return;
    }

    const target = $event.target as HTMLInputElement;
    const decimalLimit = this.maskOptions.decimalLimit || numberMaskDefaultOptions.decimalLimit;
    const decimalSymbol = target.value.includes(',') ? ',' : target.value.includes('.') ? '.' : '';

    const isNumberKey = !Number.isNaN(+$event.key);
    const hasDecimalLimitReached =
      decimalSymbol &&
      target.value.substring(target.value.indexOf(decimalSymbol) + 1).length === decimalLimit;
    const isCursorOnDecimal =
      target.selectionStart === target.selectionEnd &&
      target.selectionStart >= target.value.length - decimalLimit;
    const isNeedToPrevent = isNumberKey && hasDecimalLimitReached && isCursorOnDecimal;

    if (isNeedToPrevent) {
      $event.preventDefault();
    }
  }
}
