import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ErrorTemplate } from '../../../../typings';

@Component({
  selector: 'epgu-constructor-time-slot-empty-error',
  templateUrl: './time-slot-empty-error.component.html',
  styleUrls: ['time-slot-empty-error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeSlotEmptyErrorComponent {
  @Input() error: ErrorTemplate;
}
