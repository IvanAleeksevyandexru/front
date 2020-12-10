import { CurrencyPipe } from '@angular/common';
import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[epgu-constructor-currency-transform]'
})
export class CurrencyTransformDirective {
  @Input('epgu-constructor-currency-transform') currency: boolean;

  constructor(private currencyPipe: CurrencyPipe) {}

  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent): boolean {
    if (this.currency) {
      return event.key != ' ' && (event.key >= '0' && event.key <= '9');
    }
  }

  @HostListener('input', ['$event.target'])
  onInput(target: HTMLInputElement): void {
    if (this.currency) {
      target.value = target.value.replace(/[^\d]/g, '') || '0';
    }
  }

  @HostListener('change', ['$event.target'])
  onBlur(target: HTMLInputElement): void {
    if (this.currency) {
      let price = target.value || '0';
      if (!Number.isNaN(+price)) {
        target.value = this.currencyPipe.transform(price.substring(0, 10), 'RUB', 'symbol-narrow', '0.0-0');
      }
    }
  }
}
