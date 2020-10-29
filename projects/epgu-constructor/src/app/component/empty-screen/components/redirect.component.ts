import { Component, Input } from '@angular/core';

/**
 * Модуль для редиректа на нужный адрес
 */
@Component({
  selector: 'epgu-constructor-redirect',
  template: '',
})
export class RedirectComponent {
  @Input() set link(link: string) {
    window.location.href = link;
  }
}
