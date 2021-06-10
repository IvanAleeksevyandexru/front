import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * Модуль для редиректа на нужный адрес
 */
@Component({
  selector: 'epgu-constructor-redirect',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RedirectComponent {
  @Input() set link(link: Function) {
    if (link) link();
  }
}
