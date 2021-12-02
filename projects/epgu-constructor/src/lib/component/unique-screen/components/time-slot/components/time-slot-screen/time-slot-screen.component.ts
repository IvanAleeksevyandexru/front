import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { ScreenService } from '../../../../../../screen/screen.service';
import { TimeSlotCalendarService } from '../../services/calendar/time-slot-calendar.service';

@Component({
  selector: 'epgu-constructor-time-slot-screen',
  templateUrl: './time-slot-screen.component.html',
  styleUrls: ['./time-slot-screen.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeSlotScreenComponent {
  showNav$ = this.screenService.showNav$;
  header$: Observable<string> = this.screenService.display$.pipe(pluck('header'));
  isVisibleDays$ = this.calendar.isVisibleDays$;
  constructor(private calendar: TimeSlotCalendarService, private screenService: ScreenService) {}
}
