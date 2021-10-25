import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'epgu-constructor-time-slot-base-screen',
  templateUrl: './time-slot-base-screen.component.html',
  styleUrls: ['./time-slot-base-screen.component.html'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeSlotBaseScreenComponent {
  @Input() header: string;
  @Input() showNav: boolean;
}
