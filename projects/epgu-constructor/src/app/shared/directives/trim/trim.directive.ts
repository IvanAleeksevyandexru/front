import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[epgu-constructor-trim]'
})
export class TrimDirective {
  @HostListener('focusout', ['$event.target'])
  onFocusout(target) {
    target.value = target.value.trim();
  }
}
