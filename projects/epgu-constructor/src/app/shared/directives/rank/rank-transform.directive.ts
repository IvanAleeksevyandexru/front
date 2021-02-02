import { Directive, HostListener, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Directive({
  selector: '[epgu-constructor-rank-transform]'
})
export class RankTransformDirective {
  @Input('epgu-constructor-rank-transform') rank: boolean;

  constructor(private decimalPipe: DecimalPipe) {}

  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent): boolean {
    if (this.rank) {
      return event.key != ' ' && (event.key >= '0' && event.key <= '9');
    }
  }

  @HostListener('input', ['$event.target'])
  onInput(target: HTMLInputElement): void {
    if (this.rank) {
      target.value = target.value.replace(/[^\d]/g, '') || '0';
    }
  }

  @HostListener('change', ['$event.target'])
  onBlur(target: HTMLInputElement): void {
    if (this.rank) {
      let value = target.value || '0';
      if (!Number.isNaN(+value)) {
        target.value = this.decimalPipe.transform(value.substring(0, 10), '0.0-0');
      }
    }
  }
}
