import { ChangeDetectionStrategy, Component } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { TimeSlotsApiItem } from '@epgu/epgu-constructor-ui-kit';
import { TimeSlotSmev3StateService } from '../../../services/smev3-state/time-slot-smev3-state.service';
import {
  CancelFilterProvider,
  DepartmentInterface,
  TimeSlotBookRequest,
  TimeSlotRequest,
  TimeSlotValueInterface,
} from '../../../typings';

@Component({
  selector: 'epgu-constructor-time-slot-birth',
  templateUrl: './time-slot-birth.component.html',
  styleUrls: ['./time-slot-birth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeSlotBirthComponent {
  cancelFilterProvider = (() => true) as CancelFilterProvider;

  requestListParams$: Observable<Partial<TimeSlotRequest>> = combineLatest([
    this.smev3.value$,
    this.smev3.department$,
  ]).pipe(map(([value, department]) => this.getPartialListRequestParams(value, department)));

  requestBookParams$: Observable<Partial<TimeSlotBookRequest>> = combineLatest([
    this.smev3.department$,
    this.smev3.value$,
    this.smev3.config$,
  ]).pipe(
    map(([department, value, config]) =>
      this.getPartialBookRequestParams(department, value, config),
    ),
  );

  constructor(private smev3: TimeSlotSmev3StateService) {}

  getPartialListRequestParams(
    value: TimeSlotValueInterface,
    department: DepartmentInterface,
  ): Partial<TimeSlotRequest> {
    return {
      organizationId: [value.organizationId || (department.attributeValues.CODE as string)],
      caseNumber: value?.parentOrderId ?? value?.orderId,
    };
  }

  getPartialBookRequestParams(
    department: DepartmentInterface,
    value: TimeSlotValueInterface,
    config: TimeSlotsApiItem,
  ): Partial<TimeSlotBookRequest> {
    return {
      parentOrderId: value?.parentOrderId ?? value?.orderId,
      organizationId: value.organizationId || (department.attributeValues.CODE as string),
      attributes: [{ name: 'serviceId', value: value?.serviceId || config?.serviceId }],
    };
  }
}
