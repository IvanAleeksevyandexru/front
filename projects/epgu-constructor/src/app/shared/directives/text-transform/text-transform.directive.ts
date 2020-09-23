import { Directive, HostListener, Input } from '@angular/core';
import { TextTransform } from '../../types/textTransform';

@Directive({
  selector: '[epgu-constructor-text-transform]'
})
export class TextTransformDirective {
  @Input() textTransformType: TextTransform;

  @HostListener('keyup', ['$event.target'])
  onChange(target) {
    if(this.textTransformType === TextTransform.ALL) {
      target.value = this.firstLetterOfEachWordToUpperCase(target.value);
    } else if (this.textTransformType === TextTransform.FIRST) {
      target.value = this.firstLetterToUpperCase(target.value);
    }
  }

  firstLetterOfEachWordToUpperCase(value: string): string {
    let transformedValue = this.splitAndTransformString(value, ' ');
    transformedValue = this.splitAndTransformString(transformedValue, '‐');
    return transformedValue;
  }

  splitAndTransformString(value: string, separator: string): string {
    return value.split(separator).map(this.firstLetterToUpperCase).join(separator);
  }

  firstLetterToUpperCase(value: string): string {
    return value ? value.charAt(0).toUpperCase() + value.slice(1) : '';
  }
}
