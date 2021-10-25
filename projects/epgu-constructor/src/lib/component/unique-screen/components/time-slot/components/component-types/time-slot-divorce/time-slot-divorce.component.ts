import { ChangeDetectionStrategy, Component } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { DictionaryConditions, DictionarySubFilter } from '@epgu/epgu-constructor-types';
import { TimeSlotsApiItem } from '@epgu/epgu-constructor-ui-kit';

import { TimeSlotSmev3StateService } from '../../../services/smev3-state/time-slot-smev3-state.service';

import {
  DepartmentInterface,
  Slot,
  SlotListFilterProvider,
  TimeSlotBookRequest,
  TimeSlotRequest,
  TimeSlotValueInterface,
} from '../../../typings';

import { TimeSlotSmev3Service } from '../../../services/smev3/time-slot-smev3.service';
import { TimeSlotStateService } from '../../../services/state/time-slot-state.service';

@Component({
  selector: 'epgu-constructor-time-slot-divorce',
  templateUrl: './time-slot-divorce.component.html',
  styleUrls: ['./time-slot-divorce.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeSlotDivorceComponent {
  slotListFilterProvider$ = this.data.area$.pipe(
    tap(() => this.state.clearDay()),
    map((area) => ((slot: Slot) => slot.areaId === area || !area) as SlotListFilterProvider),
  );
  requestListParams$: Observable<Partial<TimeSlotRequest>> = combineLatest([
    this.smev3.value$,
    this.smev3.department$,
  ]).pipe(map(([value, department]) => this.getPartialListRequestParams(value, department)));

  requestBookParams$: Observable<Partial<TimeSlotBookRequest>> = combineLatest([
    this.smev3.value$,
    this.smev3.department$,
    this.smev3.config$,
  ]).pipe(
    map(([value, department, config]) =>
      this.getPartialBookRequestParams(value, department, config),
    ),
  );

  attributes = this.createAreaAttributes();
  department$: Observable<DepartmentInterface> = this.smev3.department$;

  constructor(
    private smev3: TimeSlotSmev3StateService,
    private data: TimeSlotSmev3Service,
    private state: TimeSlotStateService,
  ) {}

  createAreaAttributes(): DictionarySubFilter[] {
    return [
      {
        simple: {
          attributeName: 'PR3',
          condition: DictionaryConditions.CONTAINS,
          value: { asString: 'true' },
        },
      },
    ];
  }

  getPartialListRequestParams(
    value: TimeSlotValueInterface,
    department: DepartmentInterface,
  ): Partial<TimeSlotRequest> {
    return {
      organizationId: value.organizationId || department.attributeValues.CODE,
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
