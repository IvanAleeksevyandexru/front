import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { LongButtonColor } from '@epgu/epgu-constructor-types';

@Component({
  selector: 'epgu-cf-ui-long-button',
  template: `<button
    [class.loading]="isLoading"
    [class.btn--blue]="color === colors.BLUE"
    [class.btn--white]="color === colors.WHITE"
    [class.btn--shadow]="showShadow"
    [disabled]="disabled"
  >
    <ng-content></ng-content>
  </button>`,
  styleUrls: ['./long-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LongButtonComponent {
  @Input() disabled: boolean;
  @Input() isLoading: boolean;
  @Input() showShadow = true;
  @Input() color: LongButtonColor = LongButtonColor.WHITE;

  colors = LongButtonColor;
}
