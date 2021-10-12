import { CurrencyPipe } from '@angular/common';
import { Directive, ElementRef, HostListener, Input, OnInit, Renderer2 } from '@angular/core';
import { NgControl } from '@angular/forms';
import { isEmpty as _isEmpty } from 'lodash';

@Directive({
  selector: '[epgu-cf-ui-currency-transform]',
})
export class CurrencyTransformDirective implements OnInit {
  @Input('epgu-cf-ui-currency-transform') currency: boolean;

  constructor(
    private currencyPipe: CurrencyPipe,
    private ngControl: NgControl,
    private elRef: ElementRef,
    private renderer: Renderer2,
  ) {}

  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent): boolean {
    if (this.currency) {
      return event.key != ' ' && event.key >= '0' && event.key <= '9';
    }
  }

  @HostListener('input', ['$event.target'])
  onInput(target: HTMLInputElement): void {
    if (this.currency) {
      const value = target.value.replace(/[^\d]|^0/g, '');
      this.renderer.setProperty(target, 'value', value);
    }
  }

  @HostListener('change', ['$event.target'])
  onBlur(target: HTMLInputElement): void {
    if (this.currency) {
      let price = target.value;
      if (!Number.isNaN(+price)) {
        this.renderer.setProperty(target, 'value', this.normalizeCurrency(price));
        this.ngControl.control.setValue(price.replace(/\s+/g, ''), {
          emitModelToViewChange: false,
        });
      }
    }
  }

  public ngOnInit(): void {
    const { value } = this.ngControl.control;
    if (!_isEmpty(value) && this.currency) {
      const inputEl = this.elRef.nativeElement.querySelector('input');
      this.renderer.setProperty(inputEl, 'value', this.normalizeCurrency(value));
    }
  }

  private normalizeCurrency(value: string): string {
    return this.currencyPipe.transform(value.substring(0, 10), 'RUB', 'symbol-narrow', '0.0-0');
  }
}
