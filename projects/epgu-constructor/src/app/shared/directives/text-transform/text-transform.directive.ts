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
      target.value = target.value.toUpperCase();
    } else if (this.textTransformType === TextTransform.FIRST) {
      target.value = target.value.charAt(0).toUpperCase() + target.value.slice(1);
    }
  }
}
