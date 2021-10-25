import { ChangeDetectionStrategy, Component } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
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
  selector: 'epgu-constructor-time-slot-mvd',
  templateUrl: './time-slot-mvd.component.html',
  styleUrls: ['./time-slot-mvd.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeSlotMvdComponent {
  cancelFilterProvider = (() => false) as CancelFilterProvider;

  requestListParams$: Observable<Partial<TimeSlotRequest>> = combineLatest([
    this.smev3.value$,
    this.smev3.department$,
  ]).pipe(map(([value, department]) => this.getPartialListRequestParams(value, department)));

  requestBookParams$: Observable<Partial<TimeSlotBookRequest>> = combineLatest([
    this.smev3.value$,
    this.smev3.department$,
    this.smev3.config$,
  ]).pipe(map(([value]) => this.getPartialBookRequestParams(value)));

  constructor(private smev3: TimeSlotSmev3StateService) {}

  getPartialListRequestParams(
    value: TimeSlotValueInterface,
    department: DepartmentInterface,
  ): Partial<TimeSlotRequest> {
    return {
      organizationId: value.organizationId || department.value,
      caseNumber: value.parentOrderId as string,
    };
  }

  getPartialBookRequestParams({
    parentOrderId,
    orderId,
  }: TimeSlotValueInterface): Partial<TimeSlotBookRequest> {
    return {
      parentOrderId: (parentOrderId ?? '') as string,
      caseNumber: (orderId ?? '') as string,
    };
  }
}
