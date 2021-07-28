import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'epgu-cf-ui-long-button',
  template: `<button [class.loading]="isLoading" [disabled]="disabled">
    <ng-content></ng-content>
  </button>`,
  styleUrls: ['./long-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LongButtonComponent {
  @Input() disabled: boolean;
  @Input() isLoading: boolean;
}
