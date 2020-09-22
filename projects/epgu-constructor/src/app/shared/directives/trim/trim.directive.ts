import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[epgu-constructor-trim]'
})
export class TrimDirective {
  @HostListener('focusout', ['$event.target'])
  onFocusout(target) {
    let value = this.removeNonAlphabeticOrNumeralSymbolsFromBeginning(target.value);
    value = this.removeExtraSpacesBetweenWords(value);
    target.value = value.trim();
  }

  removeNonAlphabeticOrNumeralSymbolsFromBeginning(value: string): string {
    const index = value.match(/[0-9a-zA-Za-яА-Я]/)?.index;
    return index ? value.slice(index) : value;
  }

  removeExtraSpacesBetweenWords(value: string): string {
    return value.replace(/\s+/g, ' ');
  }

}
