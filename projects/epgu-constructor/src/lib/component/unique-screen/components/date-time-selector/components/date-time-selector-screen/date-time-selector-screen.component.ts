import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, EMPTY, Observable, Subject, Subscription } from 'rxjs';
import { ConfirmationModal, DisplayDto } from '@epgu/epgu-constructor-types';
import {
  DATE_STRING_YEAR_MONTH,
  DATE_TIME_STRING_FULL,
  DatesToolsService,
  ModalService,
  UnsubscribeService,
} from '@epgu/epgu-constructor-ui-kit';
import { concatMapTo, map, switchMap, switchMapTo, take, takeUntil, tap } from 'rxjs/operators';
import { ListItem } from '@epgu/ui/models/dropdown';
import { ScreenService } from '../../../../../../screen/screen.service';
import { StateService } from '../../services/state/state.service';
import { TimeSlotsTypes } from '../../../time-slots/time-slots.constants';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { ActionService } from '../../../../../../shared/directives/action/action.service';
import {
  DepartmentInterface,
  SmevBookResponseInterface,
  TimeSlotsAnswerInterface,
} from '../../../time-slots/time-slots.types';
import { ConfirmationModalComponent } from '../../../../../../modal/confirmation-modal/confirmation-modal.component';
import { NEXT_STEP_ACTION } from '../../../../../../shared/constants/actions';
import { Slot } from '../../typings';
import { SlotsService } from '../../services/slots/slots.service';
import { ErrorService, ErrorTypeTemplate } from '../../services/error/error.service';

type HandlerAction = () => void;

@Component({
  selector: 'epgu-constructor-date-time-selector-screen',
  templateUrl: './date-time-selector-screen.component.html',
  styleUrls: ['./date-time-selector-screen.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class DateTimeSelectorScreenComponent implements OnInit, OnDestroy {
  progress$ = this.state.progress$;
  loaded$ = this.progress$.pipe(map((status) => !status));
  isExistsSlots$$ = new BehaviorSubject<boolean>(false);
  isNotExistsSlots$ = this.isExistsSlots$$.pipe(map((status) => !status));
  disabled$ = combineLatest([
    this.currentAnswers.isValid$,
    this.progress$,
    this.state.selectedSlot$,
  ]).pipe(map(([isValid, loading, selectedSlot]) => !isValid || loading || !selectedSlot?.slotId));
  bookedInfo$ = this.state.bookedInfo$;

  typeList = TimeSlotsTypes;

  isLoading$: Observable<boolean> = this.screenService.isLoading$;
  data$: Observable<DisplayDto> = this.screenService.display$;

  templates$ = this.error.templates$$.asObservable();
  templateType = ErrorTypeTemplate;

  next$$ = new Subject<null>();

  next$ = this.next$$.pipe(
    switchMapTo(
      combineLatest([
        this.state.bookedSlot$,
        this.state.department$,
        this.state.selectedSlot$,
        this.state.cachedAnswer$,
        this.state.slotsForCancel$,
      ]).pipe(
        switchMap(
          ([bookedSlot, department, selectedSlot, cachedAnswer, slotsForCancel]: [
            Slot,
            DepartmentInterface,
            Slot,
            TimeSlotsAnswerInterface,
            TimeSlotsAnswerInterface[],
          ]) => this.processing(selectedSlot, bookedSlot, department, cachedAnswer, slotsForCancel),
        ),
        take(1),
      ),
    ),
  );

  cancel$ = this.slots.cancel$;
  book$ = this.slots.book$;

  subscriptions = new Subscription()
    .add(this.error.error$.subscribe())
    .add(this.cancel$.subscribe())
    .add(this.book$.subscribe());

  nextStepAction = NEXT_STEP_ACTION;
  id = this.screenService.component.id;

  constructor(
    public currentAnswers: CurrentAnswersService,
    public state: StateService,
    public slots: SlotsService,
    public screenService: ScreenService,
    public actionService: ActionService,
    public datesTools: DatesToolsService,
    public modalService: ModalService,
    private ngUnsubscribe$: UnsubscribeService,
    private error: ErrorService,
  ) {}

  isExistsSlotsAction(status): void {
    this.isExistsSlots$$.next(status);
  }

  ngOnInit(): void {
    const isSmev2 = this.state.isSmev2$$.getValue();

    this.error.setTemplate(
      ErrorTypeTemplate.DAYS_NOT_FOUND,
      isSmev2 ? 'В этот день всё занято' : 'В этом месяце всё занято',
      isSmev2
        ? 'Выберите другой день, чтобы забронировать время'
        : 'Выберите другой месяц или подразделение, чтобы забронировать время',
    );
    this.next$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  showModal(params: ConfirmationModal): Observable<string> {
    return this.modalService.openModal(ConfirmationModalComponent, {
      ...params,
    });
  }

  setResult(result: TimeSlotsAnswerInterface): void {
    this.currentAnswers.state = { ...result };
  }

  swtichAction(result: TimeSlotsAnswerInterface): void {
    this.setResult(result);
    this.actionService.switchAction(this.nextStepAction, this.id);
  }

  book(
    department: DepartmentInterface,
    currentSlot: Slot,
    slotsForCancel: TimeSlotsAnswerInterface[],
  ): Observable<SmevBookResponseInterface> {
    return this.slots.cancel(slotsForCancel).pipe(
      tap(() => this.state.bookedSlot$$.next(null)),
      tap(() => this.state.bookId$$.next(null)),
      concatMapTo(this.slots.book(currentSlot)),
      tap(() =>
        this.state.selectedMonth$$.next(
          this.datesTools.format(currentSlot.slotTime, DATE_STRING_YEAR_MONTH),
        ),
      ),
      tap((result) => {
        this.swtichAction({
          ...result,
          department,
        } as TimeSlotsAnswerInterface);
      }),
    );
  }

  processing(
    currentSlot: Slot,
    bookedSlot: Slot,
    department: DepartmentInterface,
    cachedAnswer: TimeSlotsAnswerInterface,
    slotsForCancel: TimeSlotsAnswerInterface[],
  ): Observable<SmevBookResponseInterface> {
    if (this.state.isSmev2$$.getValue()) {
      this.showModal(this.getConfirmModalParams());
      return EMPTY;
    }
    if (bookedSlot) {
      if (this.isCachedValueChanged(cachedAnswer, currentSlot)) {
        this.createConfirmModal(
          () => (() => this.book(department, currentSlot, slotsForCancel)) as HandlerAction,
        );
      } else {
        this.swtichAction(cachedAnswer);
      }
      return EMPTY;
    }
    return this.book(department, currentSlot, slotsForCancel);
  }

  changeArea(item: ListItem): void {
    if (!item) {
      return;
    }
    this.state.selectedArea$$.next(String(item.id));
    this.state.clearDateSelection();
  }

  nextSmev2(): void {
    this.actionService.switchAction(this.nextStepAction, this.screenService.component.id);
  }

  isCachedValueChanged(answer: TimeSlotsAnswerInterface, slot: Slot): boolean {
    return answer?.timeSlot.slotId !== slot.slotId;
  }

  next(): void {
    this.next$$.next();
  }

  getConfirmModalParams(): ConfirmationModal {
    const time = this.datesTools.format(
      this.state.selectedSlot$$.getValue().slotTime,
      DATE_TIME_STRING_FULL,
    );
    return {
      text: `<div class="text_modal_confirmation">
<h4>Подтверждение</h4>
<span>Вы уверены, что хотите забронировать на <strong>${time}</strong>?</span></div>`,
      showCloseButton: false,
      buttons: [
        {
          label: 'Да',
          closeModal: true,
          handler: this.nextSmev2.bind(this),
        },
        {
          label: 'Нет',
          closeModal: true,
          color: 'white',
        },
      ],
    } as ConfirmationModal;
  }

  createConfirmModal(handler: () => () => void): void {
    this.showModal({
      text: 'Вы уверены, что хотите поменять забронированное время?',
      showCloseButton: false,
      buttons: [
        {
          label: 'Да',
          closeModal: true,
          handler: handler(),
        },
        {
          label: 'Нет',
          closeModal: true,
          color: 'white',
        },
      ],
    });
  }
}
