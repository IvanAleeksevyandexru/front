import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[epgu-constructor-trim]',
})
export class TrimDirective {
  @Input() isTrim = true;
  @Input() isMultiline = false;

  @HostListener('focusout', ['$event.target'])
  onFocusOut(target: HTMLInputElement): void {
    if (this.isTrim) {
      const key = this.isMultiline ? 'textContent' : 'value';
      if(this.isNeedUpdateDueToSpaces(target[key])) {
        const value = this.removeUnacceptableSymbolsFromBeginning(target[key]);
        target[key] = this.removeExtraSpacesBetweenWords(value).trim();
        target.dispatchEvent(new Event('input')); // triggers input event for updating value in model
      }
    }
  }

  removeUnacceptableSymbolsFromBeginning(value: string): string {
    const index = value.match(/["0-9a-zA-Za-яА-ЯёЁ]/)?.index;
    return index ? value.slice(index) : value;
  }

  removeExtraSpacesBetweenWords(value: string): string {
    return value.replace(/\s{2,}/g, ' ');
  }

  private isNeedUpdateDueToSpaces(value: string): boolean {
    return /\s{2,}/g.test(value) || /^\s|\s$/.test(value);
  }
}
