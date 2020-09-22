import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[epgu-constructor-trim]'
})
export class TrimDirective {
  constructor () {
    console.log('TrimDirective constructor');
  }
  @HostListener('focusout', ['$event.target'])
  onFocusout(target) {
    console.log('TrimDirective onFocusout');
    target.value = target.value.trim();
  }
}
