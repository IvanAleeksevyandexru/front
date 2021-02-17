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
      const value = this.removeNonAlphabeticOrNumeralSymbolsFromBeginning(target[key]);
      target[key] = this.removeExtraSpacesBetweenWords(value).trim();
      target.dispatchEvent(new Event('input')); // triggers input event for updating value in model
    }
  }

  removeNonAlphabeticOrNumeralSymbolsFromBeginning(value: string): string {
    const index = value.match(/[0-9a-zA-Za-яА-ЯёЁ]/)?.index;
    return index ? value.slice(index) : value;
  }

  removeExtraSpacesBetweenWords(value: string): string {
    return value.replace(/\s+/g, ' ');
  }
}
