import { ChangeDetectionStrategy, Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { TimeSlotErrorService } from '../../../services/error/time-slot-error.service';
import { TimeSlotTemplateType } from '../../../typings';

import { TimeSlotCalendarService } from '../../../services/calendar/time-slot-calendar.service';

@Component({
  selector: 'epgu-constructor-time-slot-error',
  templateUrl: './time-slot-error.component.html',
  styleUrls: ['./time-slot-error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeSlotErrorComponent {
  templates$ = this.error.templates$$;
  types = TimeSlotTemplateType;
  haveLockedDays$ = this.calendar.haveUnlockedDays$$.pipe(map((value) => !value));
  constructor(private error: TimeSlotErrorService, public calendar: TimeSlotCalendarService) {}
}
