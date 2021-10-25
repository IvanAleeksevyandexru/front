import { Injectable } from '@angular/core';
import { distinctUntilChanged, map, pluck, shareReplay } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConfigService, TimeSlotsApiItem } from '@epgu/epgu-constructor-ui-kit';
import { JsonHelperService } from '../../../../../../core/services/json-helper/json-helper.service';
import { ScreenService } from '../../../../../../screen/screen.service';
import {
  TimeSlotAttribute,
  DepartmentInterface,
  TimeSlotsAnswerInterface,
  TimeSlotValueInterface,
  SlotsPeriodType,
} from '../../typings';
import { TimeSlotsTypes } from '../../time-slot.const';
import { IBookingErrorHandling, SlotsNotFoundTemplate } from '@epgu/epgu-constructor-types';

@Injectable()
export class TimeSlotSmev3StateService {
  value$ = this.screenService.componentValue$ as Observable<TimeSlotValueInterface>;

  timeSlotRequestAttrs$ = this.value$.pipe(pluck('timeSlotRequestAttrs')) as Observable<
    TimeSlotAttribute[]
  >;

  bookingErrorHandling$: Observable<IBookingErrorHandling[]> = this.screenService.component$.pipe(
    pluck('attrs', 'bookingErrorHandling'),
    map((value) => value ?? []),
  );
  slotsNotFoundTemplate$: Observable<SlotsNotFoundTemplate> = this.screenService.component$.pipe(
    pluck('attrs'),
    pluck('slotsNotFoundTemplate'),
  );

  ignoreRootParams$: Observable<string[]> = this.screenService.component$.pipe(
    pluck('attrs', 'ignoreRootParams'),
  );

  department$: Observable<DepartmentInterface> = this.value$.pipe(
    pluck('department'),
    map((department) => this.jsonHelperService.tryToParse(department, {}) as DepartmentInterface),
    shareReplay(),
  );

  type$: Observable<TimeSlotsTypes> = this.value$.pipe(
    pluck('timeSlotType'),
    distinctUntilChanged(),
  ) as Observable<TimeSlotsTypes>;

  config$: Observable<TimeSlotsApiItem> = this.type$.pipe(
    map((type) => this.configService.timeSlots[type]),
  );

  cachedAnswer$$ = new BehaviorSubject<TimeSlotsAnswerInterface>(
    (this.jsonHelperService.tryToParse(
      this.screenService.getCompValueFromCachedAnswers(),
    ) as TimeSlotsAnswerInterface) || null,
  );
  cachedAnswer$: Observable<TimeSlotsAnswerInterface> = this.cachedAnswer$$.asObservable();
  waitingTimeExpired$: Observable<boolean> = this.value$.pipe(pluck('waitingTimeExpired'));

  slotsPeriod$: Observable<string> = this.value$.pipe(
    pluck('slotsPeriod'),
    map((slotsPeriod) =>
      (this.jsonHelperService.tryToParse(slotsPeriod, null) as SlotsPeriodType)?.value?.substring(
        0,
        7,
      ),
    ),
  );
  solemn$: Observable<boolean> = this.value$.pipe(
    pluck('solemn'),
    map((solemn) => solemn === 'Да'),
    distinctUntilChanged(),
  );

  cancelReservation$: Observable<string[]> = this.screenService.component$.pipe(
    map(({ id, attrs: { cancelReservation }}) => (id ? [id, ...(cancelReservation || [])] : [])),
  );

  cancelList$: Observable<TimeSlotsAnswerInterface[]> = this.cancelReservation$.pipe(
    map((list) =>
      list.map(
        (item) =>
          this.jsonHelperService.tryToParse(
            this.screenService.getCompValueFromCachedAnswers(item),
            null,
          ) as TimeSlotsAnswerInterface,
      ),
    ),
  );

  attributeNameWithAddress$: Observable<string> = this.screenService.component$.pipe(
    pluck('attrs', 'attributeNameWithAddress'),
  );

  bookAttributes$: Observable<TimeSlotAttribute[]> = this.value$.pipe(
    pluck('bookAttributes'),
    map(
      (bookAttributes) =>
        this.jsonHelperService.tryToParse(bookAttributes, null) as TimeSlotAttribute[],
    ),
  );

  constructor(
    private configService: ConfigService,
    private jsonHelperService: JsonHelperService,
    private screenService: ScreenService,
  ) {}
}
