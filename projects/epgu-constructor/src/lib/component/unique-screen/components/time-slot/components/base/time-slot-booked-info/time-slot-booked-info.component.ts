import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DATE_TIME_STRING_FULL, DatesToolsService } from '@epgu/epgu-constructor-ui-kit';
import { map } from 'rxjs/operators';
import { TimeSlotSmev3Service } from '../../../services/smev3/time-slot-smev3.service';
import { Slot } from '../../../typings';

@Component({
  selector: 'epgu-constructor-time-slot-booked-info',
  templateUrl: 'time-slot-booked-info.component.html',
  styleUrls: ['./time-slot-booked-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeSlotBookedInfoComponent {
  bookedInfo$ = this.data.bookedSlot$.pipe(
    map((slot: Slot) => (slot ? this.getBookedInfo(slot) : null)),
  );

  constructor(private data: TimeSlotSmev3Service, private datesTools: DatesToolsService) {}

  getBookedInfo(slot: Slot): string {
    return this.datesTools.format(
      this.datesTools.utcOffset(slot.slotTime, slot.timezone),
      DATE_TIME_STRING_FULL,
    );
  }
}
