import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TimeSlotBookRequest, TimeSlotRequest, TimeSlotValueInterface } from '../../../typings';
import { TimeSlotSmev3StateService } from '../../../services/smev3-state/time-slot-smev3-state.service';

import { doctorHandlers } from '../../../handlers/doctor-handlers';
import { TimeSlotErrorService } from '../../../services/error/time-slot-error.service';

@Component({
  selector: 'epgu-constructor-time-slot-vaccination',
  templateUrl: './time-slot-vaccination.component.html',
  styleUrls: ['./time-slot-vaccination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeSlotVaccinationComponent implements OnInit {
  @Input() set requestBookParams(requestBookParams: Partial<TimeSlotBookRequest>) {
    this.requestBookParams$$.next(requestBookParams);
  }
  @Input() set requestListParams(requestListParams: Partial<TimeSlotRequest>) {
    this.requestListParams$$.next(requestListParams);
  }

  requestBookParams$$ = new BehaviorSubject<Partial<TimeSlotBookRequest>>({});
  requestListParams$$ = new BehaviorSubject<Partial<TimeSlotRequest>>({});

  requestBookParams$: Observable<Partial<TimeSlotBookRequest>> = combineLatest([
    this.requestBookParams$$,
    this.smev3.value$,
  ]).pipe(map(([params, value]) => ({ ...this.getPartialBookRequestParams(value), ...params })));

  constructor(private smev3: TimeSlotSmev3StateService, private error: TimeSlotErrorService) {}

  getPartialBookRequestParams({
    parentOrderId,
    orderId,
  }: TimeSlotValueInterface): Partial<TimeSlotBookRequest> {
    return {
      parentOrderId: (parentOrderId ?? '') as string,
      caseNumber: (orderId ?? '') as string,
    };
  }

  ngOnInit(): void {
    this.error.addHandlers(doctorHandlers);
  }
}
