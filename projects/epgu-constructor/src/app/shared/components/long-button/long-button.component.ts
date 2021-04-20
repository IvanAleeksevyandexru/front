import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ComponentActionDto } from 'epgu-constructor-types/dist/base/component-action-dto';
import { ComponentAnswerDto } from 'epgu-constructor-types/dist/base/qustion-component-answer';

@Component({
  selector: 'epgu-constructor-long-button',
  template: `<button [class.loading]="isLoading" [disabled]="data?.disabled || disabled">
    <ng-content></ng-content>
  </button>`,
  styleUrls: ['./long-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LongButtonComponent {
  @Input() data: Partial<ComponentActionDto | ComponentAnswerDto>;
  @Input() disabled: boolean;
  @Input() isLoading: boolean;
}
