import { CurrencyPipe } from '@angular/common';
import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[epgu-constructor-currency-transform]'
})
export class CurrencyTransformDirective {
  @Input('epgu-constructor-currency-transform') currency: boolean;

  constructor(private currencyPipe: CurrencyPipe) {
  }

  @HostListener('change', ['$event.target'])
  onBlur(target) {
    if (this.currency) {
      let price = target.value ? +(target.value.replace(/[^\d,]/g, '').replace(/,/, '.')) : 0;
      if (!Number.isNaN(price)) {
        target.value = this.currencyPipe.transform(price, 'RUB', 'symbol-narrow', '0.0-0');
      }
    }
  }
}
