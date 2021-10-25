import { ChangeDetectionStrategy, Component } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { TimeSlotsApiItem } from '@epgu/epgu-constructor-ui-kit';
import { map } from 'rxjs/operators';
import { TimeSlotSmev3StateService } from '../../../services/smev3-state/time-slot-smev3-state.service';
import {
  CancelFilterProvider,
  TimeSlotBookRequest,
  TimeSlotRequest,
  DepartmentInterface,
  TimeSlotValueInterface,
} from '../../../typings';

@Component({
  selector: 'epgu-constructor-time-slot-gibdd',
  templateUrl: './time-slot-gibdd.component.html',
  styleUrls: ['./time-slot-gibdd.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeSlotGibddComponent {
  cancelFilterProvider = ((item) => !!item) as CancelFilterProvider;
  requestListParams$: Observable<Partial<TimeSlotRequest>> = combineLatest([
    this.smev3.value$,
    this.smev3.department$,
    this.smev3.config$,
  ]).pipe(
    map(([value, department, config]) =>
      this.getPartialListRequestParams(value, department, config),
    ),
  );

  requestBookParams$: Observable<Partial<TimeSlotBookRequest>> = combineLatest([
    this.smev3.value$,
    this.smev3.department$,
    this.smev3.config$,
  ]).pipe(
    map(([value, department, config]) =>
      this.getPartialBookRequestParams(value, department, config),
    ),
  );

  constructor(private smev3: TimeSlotSmev3StateService) {}

  getPartialListRequestParams(
    value: TimeSlotValueInterface,
    department: DepartmentInterface,
    { serviceId }: TimeSlotsApiItem,
  ): Partial<TimeSlotRequest> {
    return {
      organizationId: value.organizationId || department.attributeValues.code,
      attributes: [
        { name: 'organizationId', value: department.attributeValues.code },
        { name: 'serviceId', value: (value.serviceId as string) || serviceId },
      ],
    };
  }

  getPartialBookRequestParams(
    value: TimeSlotValueInterface,
    department: DepartmentInterface,
    config: TimeSlotsApiItem,
  ): Partial<TimeSlotBookRequest> {
    return {
      attributes: [{ name: 'serviceId', value: value.serviceId || config.serviceId }],
    };
  }
}
