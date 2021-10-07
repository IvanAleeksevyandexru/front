import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, from, Observable, of } from 'rxjs';
import { DateTypeTypes, TimeSlotsTypes } from '../../../time-slots/time-slots.constants';
import {
  DepartmentInterface,
  TimeSlotsAnswerInterface,
  TimeSlotValueInterface,
} from '../../../time-slots/time-slots.types';
import {
  distinctUntilChanged,
  map,
  pluck,
  shareReplay,
  switchMap,
  switchMapTo,
} from 'rxjs/operators';
import { JsonHelperService } from '../../../../../../core/services/json-helper/json-helper.service';
import { ScreenService } from '../../../../../../screen/screen.service';
import { Slot, SlotsPeriodType, TimeSlot, TimeSlotAttributes } from '../../typings';
import {
  ConfigService,
  DATE_TIME_STRING_FULL,
  DatesToolsService,
  TimeSlotsApiItem,
} from '@epgu/epgu-constructor-ui-kit';
import { ComponentRestrictionsDto } from '@epgu/epgu-constructor-types';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';

@Injectable()
export class StateService {
  progress$$ = new BehaviorSubject<boolean>(false);
  progress$ = this.progress$$.asObservable();

  selectedSlot$$ = new BehaviorSubject<Slot>(null);
  selectedSlot$ = this.selectedSlot$$.asObservable();

  date$$ = new BehaviorSubject<Date>(null);
  date$ = this.date$$.asObservable();

  selectedArea$$ = new BehaviorSubject<string>(null);
  selectedArea$ = this.selectedArea$$.asObservable();

  cachedAnswer$$ = new BehaviorSubject<TimeSlotsAnswerInterface>(
    (this.jsonHelperService.tryToParse(
      this.screenService.getCompValueFromCachedAnswers(),
    ) as TimeSlotsAnswerInterface) || null,
  );
  cachedAnswer$: Observable<TimeSlotsAnswerInterface> = this.cachedAnswer$$.asObservable();

  bookId$$ = new BehaviorSubject<string>(this.cachedAnswer$$.getValue()?.bookId || null);
  bookId$ = this.bookId$$.asObservable();

  isSmev2$$ = new BehaviorSubject(this.screenService.component?.attrs?.isSmev2 || false);
  isSmev2$: Observable<boolean> = this.isSmev2$$.asObservable();

  startSection$ = this.screenService.component$.pipe(pluck('attrs', 'startSection'));
  daysToShow$ = this.screenService.component$.pipe(pluck('attrs', 'daysToShow'));
  isMonthsRangeVisible$ = this.screenService.component$.pipe(
    pluck('attrs', 'isMonthsRangeVisible'),
  );

  cancelReservation$: Observable<string[]> = this.screenService.component$.pipe(
    map(({ id, attrs: { cancelReservation }}) => (id ? [id, ...(cancelReservation || [])] : [])),
  );

  value$ = this.screenService.componentValue$ as Observable<TimeSlotValueInterface>;

  department$: Observable<DepartmentInterface> = this.value$.pipe(
    pluck('department'),
    map((department) => this.jsonHelperService.tryToParse(department, {}) as DepartmentInterface),
    shareReplay(),
  );

  type$: Observable<TimeSlotsTypes> = this.value$.pipe(
    pluck('timeSlotType'),
    distinctUntilChanged(),
  ) as Observable<TimeSlotsTypes>;

  solemn$: Observable<boolean> = this.value$.pipe(
    pluck('solemn'),
    map((solemn) => solemn === 'Да'),
    distinctUntilChanged(),
  );

  today$$ = new BehaviorSubject<null>(null);

  today$: Observable<Date> = this.today$$.pipe(
    switchMapTo(from(this.datesToolsService.getToday(true))),
    shareReplay(),
  );

  selectedMonth$$ = new BehaviorSubject<string>(null);

  selectedMonth$ = this.selectedMonth$$.pipe(
    switchMap((month) =>
      month
        ? of(month)
        : combineLatest([this.type$, this.slotsPeriod$]).pipe(
            map(([type, slotsPeriod]) => (type === TimeSlotsTypes.BRAK ? slotsPeriod : null)),
          ),
    ),
  );

  refDate$ = combineLatest([
    this.today$,
    this.screenService.component$.pipe(pluck('attrs', 'dateType')),
    this.screenService.component$.pipe(pluck('attrs', 'refDate')),
  ]).pipe(
    map(([today, dateType, refDate]) => this.getRefDate(today, dateType as DateTypeTypes, refDate)),
  );

  restrictions$: Observable<ComponentRestrictionsDto> = this.screenService.component$.pipe(
    pluck('attrs', 'restrictions'),
    map((value) => (value ?? {}) as ComponentRestrictionsDto),
  );

  timeSlotRequestAttrs$ = this.value$.pipe(pluck('timeSlotRequestAttrs')) as Observable<
    TimeSlotAttributes
  >;

  attributeNameWithAddress$: Observable<string> = this.screenService.component$.pipe(
    pluck('attrs', 'attributeNameWithAddress'),
  );
  ignoreRootParams$: Observable<string[]> = this.screenService.component$.pipe(
    pluck('attrs', 'ignoreRootParams'),
  );

  bookAttributes$: Observable<TimeSlotAttributes> = this.value$.pipe(
    pluck('bookAttributes'),
    map(
      (bookAttributes) =>
        this.jsonHelperService.tryToParse(bookAttributes, null) as TimeSlotAttributes,
    ),
  );

  slotsPeriod$: Observable<string> = this.value$.pipe(
    pluck('slotsPeriod'),
    map((slotsPeriod) =>
      (this.jsonHelperService.tryToParse(slotsPeriod, null) as SlotsPeriodType)?.value?.substring(
        0,
        7,
      ),
    ),
  );

  isBookedDepartment$$ = new BehaviorSubject<boolean>(null);
  isBookedDepartment$: Observable<boolean> = combineLatest([
    this.isBookedDepartment$$,
    this.cachedAnswer$,
    this.department$,
  ]).pipe(
    map(([isBookedDepartment, cachedAnswer, department]) =>
      isBookedDepartment !== null
        ? isBookedDepartment
        : this.isBookedDepartment(cachedAnswer, department),
    ),
  );

  waitingTimeExpired$: Observable<boolean> = this.value$.pipe(pluck('waitingTimeExpired'));

  bookedSlot$$ = new BehaviorSubject<Slot>(null);
  bookedSlot$ = combineLatest([
    this.waitingTimeExpired$,
    this.cachedAnswer$.pipe(pluck('timeSlot')),
    this.bookedSlot$$,
  ]).pipe(
    map(([waitingTimeExpired, timeSlot, bookedSlot]) =>
      bookedSlot ?? (!waitingTimeExpired && !!timeSlot) ? this.getSlot(timeSlot) : null,
    ),
  );

  bookedInfo$ = this.bookedSlot$.pipe(
    map((slot: Slot) => (!!slot ? this.getBookedInfo(slot) : null)),
  );

  config$: Observable<TimeSlotsApiItem> = this.type$.pipe(
    map((type) => this.configService.timeSlots[type]),
  );

  slotsForCancel$ = combineLatest([
    this.cancelReservation$,
    this.type$,
    this.department$,
    this.waitingTimeExpired$,
  ]).pipe(
    map(
      ([list, type, department, waitingTimeExpired]) =>
        list
          .map((item) =>
            this.jsonHelperService.tryToParse(
              this.screenService.getCompValueFromCachedAnswers(item),
              null,
            ),
          )
          .filter(
            (item: TimeSlotsAnswerInterface) =>
              !!item &&
              type !== TimeSlotsTypes.MVD &&
              (!this.isBookedDepartment(item, department) ||
                waitingTimeExpired ||
                type === TimeSlotsTypes.GIBDD),
          ) as TimeSlotsAnswerInterface[],
    ),
    shareReplay(),
  );

  constructor(
    private configService: ConfigService,
    private jsonHelperService: JsonHelperService,
    private screenService: ScreenService,
    private datesToolsService: DatesToolsService,
    private currentAnswers: CurrentAnswersService,
  ) {}

  getRefDate(today: Date, dateType: DateTypeTypes, refDate: string): Date {
    if (dateType === DateTypeTypes.TODAY) {
      return today;
    }

    if (dateType === DateTypeTypes.REF_DATE && refDate) {
      return new Date(refDate);
    }
    return null;
  }

  getBookedInfo(slot: Slot): string {
    return this.datesToolsService.format(
      this.datesToolsService.utcOffset(slot.slotTime, slot.timezone),
      DATE_TIME_STRING_FULL,
    );
  }

  getSlot(slot: TimeSlot): Slot {
    return {
      slotId: slot.slotId,
      slotTime: new Date(slot.visitTimeISO),
      timezone: slot.visitTimeISO.substr(-6),
      areaId: slot.areaId,
    };
  }

  isBookedDepartment(
    cachedAnswer: TimeSlotsAnswerInterface,
    department: DepartmentInterface,
  ): boolean {
    return (
      cachedAnswer?.department.value === department.value &&
      cachedAnswer?.department.attributeValues?.AREA_NAME == department.attributeValues?.AREA_NAME
    );
  }

  clearTimeSlotSelection(): void {
    this.selectedSlot$$.next(null);
    this.currentAnswers.state = null;
  }
  clearDateSelection(): void {
    this.date$$.next(null);
    this.clearTimeSlotSelection();
  }
}
