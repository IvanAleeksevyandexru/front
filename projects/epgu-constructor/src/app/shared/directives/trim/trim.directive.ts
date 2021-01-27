import { Directive, HostListener, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Directive({
  selector: '[epgu-constructor-trim]',
})
export class TrimDirective {
  @Input() isTrim = true;
  @Input() trimControl?: FormControl;

  @HostListener('focusout', ['$event.target'])
  onFocusOut(target: HTMLInputElement): void {
    if (this.isTrim) {
      if (this.trimControl) {
        let value = this.removeNonAlphabeticOrNumeralSymbolsFromBeginning(
          this.trimControl.value as string,
        );
        value = this.removeExtraSpacesBetweenWords(value);
        this.trimControl.setValue(value.trim());
      } else {
        let value = this.removeNonAlphabeticOrNumeralSymbolsFromBeginning(target.value);
        value = this.removeExtraSpacesBetweenWords(value);
        target.value = value.trim();
        target.dispatchEvent(new Event('input')); // triggers input event for updating value in model
      }
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
