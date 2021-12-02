import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DATE_TIME_STRING_FULL, DatesToolsService } from '@epgu/epgu-constructor-ui-kit';
import { filter, map } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { TimeSlotSmev3Service } from '../../../services/smev3/time-slot-smev3.service';
import { Slot } from '../../../typings';

@Component({
  selector: 'epgu-constructor-time-slot-booked-info',
  templateUrl: 'time-slot-booked-info.component.html',
  styleUrls: ['./time-slot-booked-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeSlotBookedInfoComponent {
  bookedInfo$ = combineLatest([this.data.bookedSlot$, this.data.isBookedDepartment$]).pipe(
    filter(([bookedSlot, isBookedDepartment]) => isBookedDepartment && !!bookedSlot),
    map(([slot]) => (slot ? this.getBookedInfo(slot) : null)),
  );

  constructor(private data: TimeSlotSmev3Service, private datesTools: DatesToolsService) {}

  getBookedInfo(slot: Slot): string {
    return this.datesTools.format(
      this.datesTools.utcOffset(slot.slotTime, slot.timezone),
      DATE_TIME_STRING_FULL,
    );
  }
}
