import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CancelFilterProvider,
  TimeSlotBookRequest,
  TimeSlotRequest,
  TimeSlotValueInterface,
} from '../../../typings';
import { map } from 'rxjs/operators';
import { TimeSlotSmev3StateService } from '../../../services/smev3-state/time-slot-smev3-state.service';

@Component({
  selector: 'epgu-constructor-time-slot-default',
  templateUrl: './time-slot-default.component.html',
  styleUrls: ['./time-slot-default.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeSlotDefaultComponent {
  cancelFilterProvider = (() => true) as CancelFilterProvider;

  requestListParams$: Observable<Partial<TimeSlotRequest>> = this.smev3.value$.pipe(
    map((value) => this.getPartialListRequestParams(value)),
  );

  requestBookParams$: Observable<Partial<TimeSlotBookRequest>> = this.smev3.value$.pipe(
    map((value) => this.getPartialBookRequestParams(value)),
  );

  constructor(private smev3: TimeSlotSmev3StateService) {}

  getPartialListRequestParams(value: TimeSlotValueInterface): Partial<TimeSlotRequest> {
    return {
      routeNumber: value?.routeNumber,
    };
  }

  getPartialBookRequestParams(value: TimeSlotValueInterface): Partial<TimeSlotBookRequest> {
    return {
      subject: value?.subject,
      calendarName: value?.calendarName,
      serviceCode: value?.serviceCode,
      preliminaryReservation: value?.preliminaryReservation,
      preliminaryReservationPeriod: value?.preliminaryReservationPeriod,
      routeNumber: value?.routeNumber,
    };
  }
}
