import { ChangeDetectionStrategy, Component } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { DictionaryConditions, DictionarySubFilter } from '@epgu/epgu-constructor-types';
import { TimeSlotSmev3StateService } from '../../../services/smev3-state/time-slot-smev3-state.service';
import {
  Slot,
  SlotListFilterProvider,
  TimeSlotRequest,
  DepartmentInterface,
  TimeSlotValueInterface,
} from '../../../typings';
import { TimeSlotSmev3Service } from '../../../services/smev3/time-slot-smev3.service';
import { TimeSlotStateService } from '../../../services/state/time-slot-state.service';

@Component({
  selector: 'epgu-constructor-time-slot-marriage',
  templateUrl: './time-slot-marriage.component.html',
  styleUrls: ['./time-slot-marriage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeSlotMarriageComponent {
  slotListFilterProvider$ = this.data.area$.pipe(
    tap(() => this.state.clearDay()),
    map((area) => ((slot: Slot) => slot.areaId === area || !area) as SlotListFilterProvider),
  );
  solemn$: Observable<boolean> = this.smev3.solemn$;
  department$: Observable<DepartmentInterface> = this.smev3.department$;
  defaultMonth$ = this.smev3.slotsPeriod$;
  months$ = this.smev3.slotsPeriod$.pipe(map((period) => [period]));

  requestListParams$: Observable<Partial<TimeSlotRequest>> = combineLatest([
    this.smev3.value$,
    this.smev3.department$,
    this.smev3.slotsPeriod$,
    this.solemn$,
  ]).pipe(
    map(([value, department, slotsPeriod, solemn]) =>
      this.getPartialListRequestParams(value, department, slotsPeriod, solemn),
    ),
  );

  attributes$ = combineLatest([this.solemn$]).pipe(
    map(([solemn]) => this.createAreaAttributes(solemn)),
  );

  constructor(
    private smev3: TimeSlotSmev3StateService,
    private data: TimeSlotSmev3Service,
    private state: TimeSlotStateService,
  ) {}

  createAreaAttributes(solemn: boolean): DictionarySubFilter[] {
    return [
      {
        simple: {
          attributeName: 'PR2',
          condition: DictionaryConditions.CONTAINS,
          value: { asString: 'true' },
        },
      },
      {
        simple: {
          attributeName: 'SOLEMN',
          condition: DictionaryConditions.EQUALS,
          value: { asString: solemn ? 'true' : 'false' },
        },
      },
    ];
  }

  getPartialListRequestParams(
    value: TimeSlotValueInterface,
    department: DepartmentInterface,
    slotsPeriod: string,
    solemn: boolean,
  ): Partial<TimeSlotRequest> {
    return {
      organizationId: value.organizationId || department.attributeValues.CODE,
      attributes: [
        { name: 'SolemnRegistration', value: solemn },
        { name: 'SlotsPeriod', value: slotsPeriod },
      ],
    };
  }
}
