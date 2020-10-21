import { Component, Input } from '@angular/core';
import { QuestionsComponentActions } from '../../../screen/questions-screen/questions-screen.types';

@Component({
  selector: 'epgu-constructor-long-button',
  template: `<button [disabled]="data?.disabled || disabled"><ng-content></ng-content></button>`,
  styleUrls: ['./long-button.component.scss'],
})
export class LongButtonComponent {
  @Input() data: QuestionsComponentActions;
  @Input() disabled: boolean;
}
