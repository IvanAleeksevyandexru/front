import { Directive, HostListener, Input, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { numberMaskDefaultOptions, MASKS } from '../../pipes/mask-handle/mask.constant';
import { NumberMaskOptionsInterface } from '../../pipes/mask-handle/interface/number-mask-options.interface';

@Directive({
  selector: '[epgu-constructor-mask-transform]',
})
export class MaskTransformDirective implements OnInit {
  @Input('epgu-constructor-mask-transform') mask: string | string[];
  @Input() maskOptions?: Partial<NumberMaskOptionsInterface>;

  private localeThousandSeparator = ',';
  private localeDecimalSeparator = '.';
  private options: Partial<NumberMaskOptionsInterface> = {};

  constructor(private decimalPipe: DecimalPipe) {}

  @HostListener('change', ['$event.target'])
  onBlur(target: HTMLInputElement): void {
    if (this.mask === MASKS.NumberMaskInput) {
      let value =
        target.value.replace(this.options.decimalSymbol, '.').replace(/[^\d.]/g, '') || '0';

      if (!Number.isNaN(+value)) {
        target.value = this.decimalPipe
          .transform(
            value.substring(0, 10),
            `0.${this.options.decimalLimit}-${this.options.decimalLimit}`,
          )
          .replace(
            new RegExp(this.localeThousandSeparator, 'g'),
            this.options.includeThousandsSeparator ? this.options.thousandsSeparatorSymbol : '',
          )
          .replace(this.localeDecimalSeparator, this.options.decimalSymbol);
      }
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
