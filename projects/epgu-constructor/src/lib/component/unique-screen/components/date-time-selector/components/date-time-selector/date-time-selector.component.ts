import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  catchError,
  concatMap,
  filter,
  finalize,
  map,
  shareReplay,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { combineLatest, iif, Observable, of } from 'rxjs';
import { ListItem } from '@epgu/ui/models/dropdown';
import {
  DatesToolsService,
  HttpCancelService,
  UnsubscribeService,
} from '@epgu/epgu-constructor-ui-kit';
import { ComponentRestrictionsDto, SectionType } from '@epgu/epgu-constructor-types';
import { ScreenService } from '../../../../../../screen/screen.service';
import { LockProvider } from '../day-selector/day-selector.component';
import { MonthHideProvider } from '../month-selector/month-selector.component';
import { Slot, SlotMap } from '../../typings';
import { SlotsService } from '../../services/slots/slots.service';
import { StateService } from '../../services/state/state.service';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import {
  NO_DATA_MESSAGE,
  STATIC_ERROR_MESSAGE,
  TimeSlotsConstants,
} from '../../../time-slots/time-slots.constants';
import { ErrorService, ErrorTypeTemplate } from '../../services/error/error.service';

@Component({
  selector: 'epgu-constructor-date-time-selector',
  templateUrl: './date-time-selector.component.html',
  styleUrls: ['./date-time-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class DateTimeSelectorComponent implements OnInit, OnDestroy {
  @Output() isExistsSlots = new EventEmitter<boolean>();
  startSection$: Observable<SectionType> = this.state.startSection$;
  daysToShow$: Observable<number> = this.state.daysToShow$;
  isMonthsRangeVisible$: Observable<boolean> = this.state.isMonthsRangeVisible$;

  date$ = this.state.date$;
  progress$ = this.state.progress$$;

  slotList$: Observable<Slot[]> = this.state.isSmev2$.pipe(
    tap(() => this.state.progress$$.next(true)),
    concatMap((isSmev2) =>
      iif(
        () => isSmev2,
        this.date$.pipe(
          switchMap((date: Date) =>
            !date
              ? []
              : this.slots.smev2getSlots(date).pipe(
                  tap((slots) => {
                    this.isExistsSlots.emit(slots.length > 0);
                  }),
                  finalize(() => this.state.progress$$.next(false)),
                ),
          ),
        ),
        combineLatest([
          this.date$,
          this.slots.store$.pipe(
            tap(() => this.storeError()),
            catchError((error) => {
              this.errorMessage = this.error.getError();
              this.error.show(
                `${this.constants.errorInitialiseService} (${this.errorMessage}) (${error})`,
              );
              return of([]);
            }),
            shareReplay(),
          ),
          this.state.bookedSlot$,
          this.state.selectedArea$,
        ]).pipe(
          tap(() => this.state.progress$$.next(false)),
          tap(() => {
            if (this.error.hasError()) {
              this.error.show(`${this.constants.errorLoadingTimeSlots} (${this.error.getError()})`);
            }
          }),
          tap(() => this.state.selectedSlot$$.next(null)),
          map(([date, slotMap, bookedSlot, area]) =>
            !date ? [] : this.getSelectedSlotList(date, bookedSlot, slotMap, area),
          ),
          shareReplay(),
        ),
      ),
    ),
  );

  selectedSlot$ = this.state.selectedSlot$;

  month$ = this.state.selectedMonth$;

  _monthsRange = new Set();
  get monthsRange(): string {
    return Array.from(this._monthsRange).join(' — ');
  }

  today$ = this.state.today$;
  errorMessage = undefined;

  availableMonths$ = this.state.isSmev2$.pipe(
    switchMap((isSmev2) =>
      iif(
        () => isSmev2,
        this.today$.pipe(map((today) => this.datesTools.getMonthListByYear(today))),
        this.slots.availableMonths$$,
      ),
    ),
  );

  monthHideProvider$: Observable<MonthHideProvider> = combineLatest([
    this.state.refDate$.pipe(map((refDate) => this.datesTools.startOf(refDate, 'month'))),
    this.state.restrictions$,
  ]).pipe(
    map(
      ([refDate, restrictions]) =>
        ((date) =>
          this.datesTools.checkDateRestrictions(
            restrictions,
            refDate,
            date,
            'month',
          )) as MonthHideProvider,
    ),
  );

  calendarLockProvider$: Observable<LockProvider> = combineLatest([
    this.state.refDate$.pipe(map((refDate) => this.datesTools.startOf(refDate, 'day'))),
    this.state.restrictions$,
    this.state.isSmev2$,
    this.state.today$,
    this.state.selectedArea$,
    this.slots.store$,
    this.state.bookedSlot$,
  ]).pipe(
    map(
      ([refDate, restrictions, isSmev2, today, selectedArea, slotMap, bookedSlot]: [
        Date,
        ComponentRestrictionsDto,
        boolean,
        Date,
        string,
        SlotMap,
        Slot,
      ]) =>
        ((day: Date) =>
          isSmev2
            ? this.datesTools.isAfter(this.datesTools.addDays(today, 1), day)
            : this.isDateLocked(day, bookedSlot, slotMap, selectedArea) ||
              this.datesTools.checkDateRestrictions(
                restrictions,
                refDate,
                day,
                'day',
              )) as LockProvider,
    ),
  );

  constructor(
    private error: ErrorService,
    private screenService: ScreenService,
    private slots: SlotsService,
    private state: StateService,
    private ngUnsubscribe$: UnsubscribeService,
    private datesTools: DatesToolsService,
    private currentAnswers: CurrentAnswersService,
    private httpCancel: HttpCancelService,
    public constants: TimeSlotsConstants,
  ) {}

  storeError(): void {
    if (this.error.hasError()) {
      this.errorMessage = this.error.getError();
      if (this.errorMessage === 101) {
        this.errorMessage = `${this.errorMessage}: ${this.constants.error101ServiceUnavailable}`;
      }
      if (this.errorMessage?.includes(STATIC_ERROR_MESSAGE)) {
        this.error.setTemplate(
          ErrorTypeTemplate.DAYS_NOT_FOUND,
          'Непредвиденная ошибка',
          this.errorMessage,
        );
      } else if (this.errorMessage?.includes(NO_DATA_MESSAGE)) {
        this.error.setTemplate(
          ErrorTypeTemplate.DAYS_NOT_FOUND,
          'Нет свободного времени для приёма',
          'Этот врач занят на ближайшие 14 дней. Выберите другого специалиста',
        );
      } else {
        this.error.show(`${this.constants.errorInitialiseService} (${this.errorMessage})`);
      }
    }
  }

  ngOnInit(): void {
    combineLatest([this.state.bookedSlot$, this.state.isBookedDepartment$])
      .pipe(
        filter(([slot, isBookedDepartment]) => slot && isBookedDepartment),
        tap(([slot]) => {
          this.selectDateAction(slot.slotTime);
          this.changeSlotAction(slot);
        }),
        takeUntil(this.ngUnsubscribe$),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.httpCancel.cancelPendingRequests();
  }

  isDateLocked(date: Date, bookedSlot: Slot, slotMap: SlotMap, area: string): boolean {
    return !this.getSelectedSlotList(date, bookedSlot, slotMap, area).length;
  }
  getSelectedSlotList(date: Date, bookedSlot: Slot, slotMap: SlotMap, area: string): Slot[] {
    return !date
      ? []
      : this.slots.addBookedTimeSlotToList(
          bookedSlot,
          this.slots.getSlotListByDate(slotMap, date, area),
        );
  }

  monthRangeChange(month: string): void {
    this._monthsRange.add(month);
  }

  hasError(): boolean {
    return !!this.getErrorMessage();
  }

  getErrorMessage(): string {
    return this.errorMessage;
  }

  changeSlotAction(slot: Slot): void {
    if (this.state.selectedSlot$$.getValue()?.slotId === slot.slotId) {
      this.state.clearTimeSlotSelection();
    } else {
      this.state.selectedSlot$$.next(slot);
      if (this.state.isSmev2$$.getValue()) {
        this.currentAnswers.state = this.slots.smev2CacheItems[slot.slotId];
      } else {
        this.currentAnswers.state = slot;
      }
    }
    this.state.selectedSlot$$.next(slot);
  }

  selectDateAction(date: Date): void {
    if (this.state.date$$.getValue()?.toISOString() === date.toISOString()) {
      this.state.clearDateSelection();
    } else {
      this.state.date$$.next(date);
    }

    this.state.date$$.next(date);
  }
  changeMonthAction(month: ListItem): void {
    this.state.selectedMonth$$.next(String(month.id));
  }

  notExistsAction(status: boolean): void {
    if (!this.state.isSmev2$$.getValue()) {
      this.isExistsSlots.emit(!status);
    }
  }
}
