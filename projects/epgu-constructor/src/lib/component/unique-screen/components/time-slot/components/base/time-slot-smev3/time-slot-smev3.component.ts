import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ComponentRestrictionsDto, IBookingErrorHandling } from '@epgu/epgu-constructor-types';
import {
  DATE_STRING_YEAR_MONTH,
  DatesToolsService,
  EventBusService,
  HttpCancelService,
  ModalService,
  UnsubscribeService,
} from '@epgu/epgu-constructor-ui-kit';
import {
  catchError,
  concatMapTo,
  distinctUntilChanged,
  filter,
  map,
  shareReplay,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { BehaviorSubject, combineLatest, EMPTY, Observable, of, Subject } from 'rxjs';
import { BaseTimeSlotComponent } from '../base-time-slot.component';

import { TimeSlotStateService } from '../../../services/state/time-slot-state.service';
import { TimeSlotCalendarService } from '../../../services/calendar/time-slot-calendar.service';
import { ScreenService } from '../../../../../../../screen/screen.service';
import { ActionService } from '../../../../../../../shared/directives/action/action.service';
import { TimeSlotSmev3Service } from '../../../services/smev3/time-slot-smev3.service';
import {
  CancelFilterProvider,
  DepartmentInterface,
  Slot,
  SlotListFilterProvider,
  SlotMap,
  SmevBookResponseInterface,
  TimeSlotBookRequest,
  TimeSlotError,
  TimeSlotRequest,
  TimeSlotsAnswerInterface,
  TimeSlotTemplateType,
} from '../../../typings';
import { TimeSlotSmev3StateService } from '../../../services/smev3-state/time-slot-smev3-state.service';
import { getConfirmChangeTimeModalParams, templateList } from './data';
import { TimeSlotErrorService } from '../../../services/error/time-slot-error.service';
import {
  SMEV2_SERVICE_OR_SPEC_SESSION_TIMEOUT,
  TimeSlotsConstants,
} from '../../../../time-slots/time-slots.constants';
import {
  ITEMS_FAILURE,
  SERVICE_OR_SPEC_SESSION_TIMEOUT,
} from '../../../../../../../core/services/error-handler/error-handler';
import { FormPlayerService } from '../../../../../../../form-player/services/form-player/form-player.service';
import { baseHandlers } from '../../../handlers/base-handlers';
import { LockProvider } from '../../../../../../../shared/components/calendar/typings';

@Component({
  selector: 'epgu-constructor-time-slot-smev3',
  templateUrl: './time-slot-smev3.component.html',
  styleUrls: ['./time-slot-smev3.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class TimeSlotSmev3Component extends BaseTimeSlotComponent implements OnInit {
  @Input() set requestListParams(params: Partial<TimeSlotRequest>) {
    this.data.requestListParams$$.next(params);
  }
  @Input() set requestBookParams(params: Partial<TimeSlotBookRequest>) {
    this.data.requestBookParams$$.next(params);
  }
  @Input() set slotListFilter(provider: SlotListFilterProvider) {
    this.slotListFilter$$.next(provider);
  }

  @Input() set slotsForCancelFilterProvider(provider: CancelFilterProvider) {
    this.data.slotsForCancelFilterProvider$$.next(provider);
  }

  @Input() set defaultMonth(month: string) {
    this.defaultMonth$$.next(month);
  }
  @Input() set months(months: string[]) {
    this.months$$.next(months);
  }

  cancelSub = this.data.cancel$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe();
  bookSub = this.data.book$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe();

  slotListFilter$$ = new BehaviorSubject<SlotListFilterProvider>(
    (() => true) as SlotListFilterProvider,
  );
  months$$ = new BehaviorSubject<string[]>(null);
  defaultMonth$$ = new BehaviorSubject<string>(null);

  month$ = combineLatest([this.state.month$, this.defaultMonth$$]).pipe(
    map(([month, defaultMonth]) => month ?? defaultMonth),
    distinctUntilChanged(),
  );

  months$ = combineLatest([this.state.months$, this.months$$]).pipe(
    map(([defaultMonths, months]) => months ?? defaultMonths),
    distinctUntilChanged(),
  );

  list$ = combineLatest([
    this.day$,
    this.data.store$.pipe(
      catchError(() => {
        return of([]);
      }),
    ),
    this.data.bookedSlot$,
    this.slotListFilter$$,
  ]).pipe(
    tap(() => this.state.setSlot(null)),
    map(
      ([date, slotMap, bookedSlot, filterProvider]: [
        Date,
        SlotMap,
        Slot,
        SlotListFilterProvider,
      ]) => this.getSlotList(date, bookedSlot, slotMap, filterProvider),
    ),
    shareReplay(),
    tap((list) => this.state.setList(list)),
    takeUntil(this.ngUnsubscribe$),
  );

  lockProvider$: Observable<LockProvider> = combineLatest([
    this.calendar.refDate$.pipe(map((refDate) => this.datesTools.startOf(refDate, 'day'))),
    this.calendar.restrictions$,
    this.data.store$,
    this.data.bookedSlot$,
    this.slotListFilter$$,
  ]).pipe(
    map(
      ([refDate, restrictions, slotMap, bookedSlot, filterProvider]: [
        Date,
        ComponentRestrictionsDto,
        SlotMap,
        Slot,
        SlotListFilterProvider,
      ]) =>
        ((day: Date) =>
          this.isDateLocked(day, bookedSlot, slotMap, filterProvider) ||
          this.datesTools.checkDateRestrictions(restrictions, refDate, day, 'day')) as LockProvider,
    ),
  );

  next$$ = new Subject<string>();

  next$ = this.next$$.pipe(
    switchMap((id: string) =>
      combineLatest([
        this.data.bookedSlot$,
        this.smev3.department$,
        this.state.slot$,
        this.smev3.cachedAnswer$,
        this.data.slotsForCancel$,
        this.smev3.bookingErrorHandling$,
      ]).pipe(
        switchMap(
          ([
            bookedSlot,
            department,
            selectedSlot,
            cachedAnswer,
            slotsForCancel,
            bookingErrorHandling,
          ]: [
            Slot,
            DepartmentInterface,
            Slot,
            TimeSlotsAnswerInterface,
            TimeSlotsAnswerInterface[],
            IBookingErrorHandling[],
          ]) =>
            this.processing(
              id,
              selectedSlot,
              bookedSlot,
              department,
              cachedAnswer,
              slotsForCancel,
              bookingErrorHandling,
            ),
        ),
        take(1),
      ),
    ),
  );

  constructor(
    public state: TimeSlotStateService,
    public calendar: TimeSlotCalendarService,
    public httpCancel: HttpCancelService,
    public datesTools: DatesToolsService,
    public ngUnsubscribe$: UnsubscribeService,
    public modal: ModalService,
    public screenService: ScreenService,
    public actionService: ActionService,
    public data: TimeSlotSmev3Service,
    public smev3: TimeSlotSmev3StateService,
    public eventBus: EventBusService,
    public error: TimeSlotErrorService,
    public constants: TimeSlotsConstants,
    public formPlayer: FormPlayerService,
  ) {
    super(state, calendar, httpCancel, screenService, eventBus, ngUnsubscribe$, modal);
  }

  showCustomError(error: TimeSlotError, bookingHandling: IBookingErrorHandling[]): void {
    if (!error) {
      return;
    }
    if (this.error.getErrorMessage().includes(SMEV2_SERVICE_OR_SPEC_SESSION_TIMEOUT)) {
      this.state
        .showModal(SERVICE_OR_SPEC_SESSION_TIMEOUT)
        .toPromise()
        .then((value) => {
          if (value) {
            this.formPlayer.initData();
          }
        });
    } else {
      const errorHandlingParams = this.findJsonParamsForErrorHandling(error, bookingHandling);
      if (errorHandlingParams) {
        this.state.showModal(errorHandlingParams.modalAttributes);
      } else {
        const params = {
          ...ITEMS_FAILURE,
          buttons: [
            {
              label: 'Начать заново',
              closeModal: true,
              value: 'init',
            },
            {
              label: 'Попробовать ещё раз',
              closeModal: true,
            },
          ],
        };
        const message = this.data.clearMessage(this.error.getErrorMessage());
        params.text = params.text.replace(/\{textAsset\}?/g, message);
        this.state
          .showModal(params)
          .toPromise()
          .then((result) => {
            if (result) {
              this.formPlayer.initData();
            }
          });
      }
    }
  }

  booking(
    id: string,
    department: DepartmentInterface,
    currentSlot: Slot,
    slotsForCancel: TimeSlotsAnswerInterface[],
    bookingErrorHandling: IBookingErrorHandling[],
  ): Observable<SmevBookResponseInterface> {
    return this.data.cancel(slotsForCancel).pipe(
      tap(() => {
        if (this.error.hasError()) {
          this.showCustomError(this.error.getError(), bookingErrorHandling);
        }
      }),
      tap(() => this.data.bookedSlot$$.next(null)),
      tap(() => this.data.bookId$$.next(null)),
      concatMapTo(this.data.book(currentSlot)),
      tap(() =>
        this.state.setMonth(this.datesTools.format(currentSlot.slotTime, DATE_STRING_YEAR_MONTH)),
      ),
      tap((result) =>
        this.setResult({
          ...result,
          department,
        } as TimeSlotsAnswerInterface),
      ),
      catchError(() => {
        this.showCustomError(this.error.getError(), bookingErrorHandling);
        return EMPTY;
      }),
      tap(() => this.finish(id)),
    );
  }

  processing(
    id: string,
    currentSlot: Slot,
    bookedSlot: Slot,
    department: DepartmentInterface,
    cachedAnswer: TimeSlotsAnswerInterface,
    slotsForCancel: TimeSlotsAnswerInterface[],
    bookingErrorHandling: IBookingErrorHandling[],
  ): Observable<SmevBookResponseInterface> {
    if (!bookedSlot) {
      return this.booking(id, department, currentSlot, slotsForCancel, bookingErrorHandling);
    }
    if (this.isCachedValueChanged(cachedAnswer, currentSlot)) {
      return this.state
        .showModal(getConfirmChangeTimeModalParams())
        .pipe(
          switchMap((result) =>
            result === 'y'
              ? this.booking(id, department, currentSlot, slotsForCancel, bookingErrorHandling)
              : EMPTY,
          ),
        );
    }
    this.setResult(cachedAnswer);
    this.finish(id);
    return EMPTY;
  }

  findJsonParamsForErrorHandling(
    error: TimeSlotError,
    bookingHandling: IBookingErrorHandling[],
  ): IBookingErrorHandling {
    if (typeof error !== 'object') {
      return null;
    }
    const errorCode = error.code;
    return bookingHandling.find((param) => {
      const isCodesEqual = param.errorCode === String(errorCode);
      return param.errorMessageRegExp
        ? isCodesEqual && error.message.match(param.errorMessageRegExp)
        : isCodesEqual;
    });
  }

  ngOnInit(): void {
    this.error.resetHandlers();
    this.error.addHandlers(baseHandlers);
    super.ngOnInit();
    this.error.errorHandling$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe();
    this.error.error$
      .pipe(
        tap((error) => {
          if (error) {
            this.data.reloadStore();
          }
        }),
        takeUntil(this.ngUnsubscribe$),
      )
      .subscribe();

    this.smev3.slotsNotFoundTemplate$
      .pipe(
        tap((template) =>
          this.error.setAllTemplates(
            template
              ? {
                  [TimeSlotTemplateType.SLOTS_NOT_FOUND]: template,
                }
              : templateList,
          ),
        ),
        take(1),
        takeUntil(this.ngUnsubscribe$),
      )
      .subscribe();
    combineLatest([this.data.bookedSlot$, this.data.isBookedDepartment$])
      .pipe(
        filter(([slot, isBookedDepartment]) => slot && isBookedDepartment),
        tap(([slot]) => {
          this.changeDayAction(slot.slotTime);
          this.changeSlotAction(slot);
        }),
        takeUntil(this.ngUnsubscribe$),
      )
      .subscribe();
    this.next$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe();
  }

  isDateLocked(
    date: Date,
    bookedSlot: Slot,
    slotMap: SlotMap,
    filterProvider: SlotListFilterProvider,
  ): boolean {
    return !this.getSlotList(date, bookedSlot, slotMap, filterProvider).length;
  }

  getSlotList(
    date: Date,
    bookedSlot: Slot,
    slotMap: SlotMap,
    filterProvider: SlotListFilterProvider,
  ): Slot[] {
    return !date
      ? []
      : this.data.addBookedTimeSlotToList(
          bookedSlot,
          this.data.getSlotListByDate(slotMap, date).filter(filterProvider),
        );
  }

  book(id: string): void {
    this.next$$.next(id);
  }

  changeHaveUnlockedDaysAction(status: boolean): void {
    this.calendar.haveUnlockedDays = status;
  }

  changeSlot(slot: Slot): void {
    this.setResult(slot);
  }

  isCachedValueChanged(answer: TimeSlotsAnswerInterface, slot: Slot): boolean {
    return answer?.timeSlot.slotId !== slot.slotId;
  }
}
