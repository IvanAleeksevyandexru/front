import { Component, Input } from '@angular/core';
import { ComponentDtoAction } from '../../../form-player/services/form-player-api/form-player-api.types';

@Component({
  selector: 'epgu-constructor-long-button',
  template: `<button [disabled]="data?.disabled || disabled"><ng-content></ng-content></button>`,
  styleUrls: ['./long-button.component.scss'],
})
export class LongButtonComponent<T extends ComponentDtoAction> {
  @Input() data: Partial<T>;
  @Input() disabled: boolean;
}
