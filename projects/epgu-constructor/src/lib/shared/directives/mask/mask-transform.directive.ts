import { Directive, HostListener, Input, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { numberMaskDefaultOptions, MASKS, NumberMaskOptions } from '@epgu/epgu-constructor-ui-kit';
import { NgControl } from '@angular/forms';
import { MaskTransformService } from './mask-transform.service';

@Directive({
  selector: '[epgu-constructor-mask-transform]',
})
export class MaskTransformDirective implements OnInit {
  @Input('epgu-constructor-mask-transform') mask: string | string[];
  @Input() maskOptions?: Partial<NumberMaskOptions>;

  private localeThousandSeparator = ',';
  private localeDecimalSeparator = '.';
  private options: Partial<NumberMaskOptions> = {};

  constructor(
      private decimalPipe: DecimalPipe,
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

  public ngOnInit(): void {
    if (this.mask === MASKS.NumberMaskInput) {
      this.localeThousandSeparator = this.decimalPipe.transform(1234, '0.0-0').replace(/\d/g, '');
      this.localeDecimalSeparator = this.decimalPipe.transform(1.23, '0.2-2').replace(/\d/g, '');
      this.options = { ...numberMaskDefaultOptions, ...this.maskOptions };
    }
  }
}
