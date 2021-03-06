import { ChangeDetectionStrategy, Component } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DictionaryConditions, DictionarySubFilter } from '@epgu/epgu-constructor-types';
import { TimeSlotSmev3StateService } from '../../../services/smev3-state/time-slot-smev3-state.service';
import {
  Slot,
  SlotListFilterProvider,
  TimeSlotRequest,
  DepartmentInterface,
  TimeSlotValueInterface,
  TimeSlotBookRequest,
  CancelFilterProvider,
} from '../../../typings';
import { TimeSlotSmev3Service } from '../../../services/smev3/time-slot-smev3.service';

@Component({
  selector: 'epgu-constructor-time-slot-marriage',
  templateUrl: './time-slot-marriage.component.html',
  styleUrls: ['./time-slot-marriage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeSlotMarriageComponent {
  cancelFilterProvider = (() => true) as CancelFilterProvider;
  slotListFilterProvider$ = this.data.area$.pipe(
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

  requestBookParams$: Observable<Partial<TimeSlotBookRequest>> = combineLatest([
    this.smev3.department$,
    this.smev3.value$,
  ]).pipe(map(([department, value]) => this.getPartialBookRequestParams(department, value)));

  attributes$ = combineLatest([this.solemn$]).pipe(
    map(([solemn]) => this.createAreaAttributes(solemn)),
  );

  constructor(private smev3: TimeSlotSmev3StateService, private data: TimeSlotSmev3Service) {}

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
      organizationId: [value.organizationId || (department.attributeValues.CODE as string)],
      attributes: [
        { name: 'SolemnRegistration', value: solemn },
        { name: 'SlotsPeriod', value: slotsPeriod },
      ],
    };
  }

  getPartialBookRequestParams(
    department: DepartmentInterface,
    value: TimeSlotValueInterface,
  ): Partial<TimeSlotBookRequest> {
    return {
      organizationId: value.organizationId || (department.attributeValues.CODE as string),
    };
  }
}
