import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { BehaviorSubject, from, Observable, Subject, Subscription } from 'rxjs';
import { catchError, filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ListItem } from '@epgu/ui/models/dropdown';
import { DisplayDto, ConfirmationModal } from '@epgu/epgu-constructor-types';
import {
  ModalService,
  UnsubscribeService,
  HttpCancelService,
  DatesToolsService,
  DATE_STRING_YEAR_MONTH,
  DATE_TIME_STRING_FULL,
  months,
  StartOfTypes,
  weekDaysAbbr,
  IDay,
  SlotInterface,
} from '@epgu/epgu-constructor-ui-kit';
import { throwError } from 'rxjs/internal/observable/throwError';
import { FormControl } from '@angular/forms';
import {
  COMMON_ERROR_MODAL_PARAMS,
  SERVICE_OR_SPEC_SESSION_TIMEOUT,
  ITEMS_FAILURE,
} from '../../../../core/services/error-handler/error-handler';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { ScreenService } from '../../../../screen/screen.service';
import { NEXT_STEP_ACTION } from '../../../../shared/constants/actions';
import { ActionService } from '../../../../shared/directives/action/action.service';
import {
  DateTypeTypes,
  TimeSlotsConstants,
  TimeSlotsTypes,
  STATIC_ERROR_MESSAGE,
  NO_DATA_MESSAGE,
  SMEV2_SERVICE_OR_SPEC_SESSION_TIMEOUT,
} from './time-slots.constants';
import { TimeSlotsService } from './time-slots.service';
import { TimeSlot, TimeSlotsAnswerInterface, TimeSlotValueInterface } from './time-slots.types';
import { ConfirmationModalComponent } from '../../../../modal/confirmation-modal/confirmation-modal.component';
import { JsonHelperService } from '../../../../core/services/json-helper/json-helper.service';
import { FormPlayerService } from '../../../../form-player/services/form-player/form-player.service';

@Component({
  selector: 'epgu-constructor-time-slots',
  templateUrl: './time-slots.component.html',
  styleUrls: ['./time-slots.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeSlotsComponent implements OnInit, OnDestroy {
  isLoading$: Observable<boolean> = this.screenService.isLoading$;
  data$: Observable<DisplayDto> = this.screenService.display$;
  slotsNotFoundTemplate = this.screenService.component.attrs?.slotsNotFoundTemplate || null;
  isSmev2 = this.screenService.component.attrs?.isSmev2 || false;

  public date: Date = null;
  public label: string;
  public activeMonthNumber: number;
  public activeYearNumber: number;
  public chosenTimeStr: string;
  public isChosenTimeStrVisible = false;
  public isFinish = new Subject<null>();

  errorTemplateCheckboxControl = new FormControl();

  daysNotFoundTemplate = {
    header: this.isSmev2 ? 'В этот день всё занято' : 'В этом месяце всё занято',
    description: this.isSmev2
      ? 'Выберите другой день, чтобы забронировать время'
      : 'Выберите другой месяц или подразделение, чтобы забронировать время',
  };

  confirmModalParameters: ConfirmationModal = {
    text: 'Вы уверены, что хотите поменять забронированное время?',
    showCloseButton: false,
    buttons: [
      {
        label: 'Да',
        closeModal: true,
        handler: this.bookTimeSlot.bind(this),
      },
      {
        label: 'Нет',
        closeModal: true,
        color: 'white',
      },
    ],
  };

  public daysOfWeek = weekDaysAbbr;
  public months = months;

  public weeks: IDay[][] = [];
  public areas: ListItem[] = [];
  public isAreasVisible = false;
  public monthsYears: ListItem[] = [];
  public timeSlots: SlotInterface[] = [];
  public dialogButtons = [];
  public isExistsSlots = true;
  public currentSlot: SlotInterface;
  public currentMonth: ListItem;
  public currentArea: ListItem;
  public blockMobileKeyboard = false;
  public fixedMonth = false;
  public inProgress = false;
  public changeTSConfirm = false;
  bookedSlot: SlotInterface;
  errorMessage;
  public isMonthsRangeVisible = false;
  public get monthsRange(): string {
    return Array.from(this._monthsRange).join(' — ');
  }
  public today: Date;

  dateSelector$$ = new BehaviorSubject<Date>(null);
  dateSelector$ = this.dateSelector$$
    .pipe(
      filter((value) => !!value),
      tap(() => {
        this.timeSlots = [];
      }),
      switchMap((date: Date) => {
        this.inProgress = true;
        return this.timeSlotsService.smev2getSlots(date).pipe(
          tap((slots) => {
            this.timeSlots = slots;
            this.inProgress = false;
            this.isExistsSlots = this.timeSlots.length > 0;
            this.changeDetectionRef.markForCheck();
          }),
          catchError((err) => {
            this.inProgress = false;
            this.changeDetectionRef.markForCheck();
            return throwError(err);
          }),
        );
      }),
      takeUntil(this.ngUnsubscribe$),
    )
    .subscribe();

  init$$ = new BehaviorSubject<boolean>(false);
  init$ = this.init$$
    .pipe(
      filter((status) => status),
      switchMap(() => from(this.datesHelperService.getToday(true))),
      tap((today: Date) => {
        this.today = today;
        if (!this.isSmev2) {
          this.loadTimeSlots();
        } else {
          this.smev2Loading();
        }
      }),
      takeUntil(this.ngUnsubscribe$),
    )
    .subscribe();

  private errorModalResultSub = new Subscription();
  private cachedAnswer: TimeSlotsAnswerInterface;
  private timeSlotType: TimeSlotsTypes;
  private nextStepAction = NEXT_STEP_ACTION;
  private emptySlotsModal: ConfirmationModal = null;
  private firstDayOfMainSection: Date;
  private daysInMainSection: number;
  private visibleMonths = {}; // Мапа видимых месяцев. Если показ идет с текущей даты и доступные дни залезли на новый месяц, то показываем этот месяц
  private _monthsRange = new Set();

  constructor(
    private modalService: ModalService,
    private currentAnswersService: CurrentAnswersService,
    public constants: TimeSlotsConstants,
    private ngUnsubscribe$: UnsubscribeService,
    public screenService: ScreenService,
    private changeDetectionRef: ChangeDetectorRef,
    private datesHelperService: DatesToolsService,
    private httpCancelService: HttpCancelService,
    private timeSlotsService: TimeSlotsService,
    private jsonHelperService: JsonHelperService,
    private actionService: ActionService,
    private formPlayer: FormPlayerService,
  ) {}

  ngOnInit(): void {
    this.initModalsSettings();
    const cachedAnswer = this.screenService.getCompValueFromCachedAnswers();
    if (cachedAnswer) {
      this.cachedAnswer = JSON.parse(cachedAnswer);
    }

    this.initSettings();

    if (this.screenService.component) {
      this.setCancelReservation(
        this.screenService.component.id,
        this.screenService.component.attrs?.cancelReservation,
      );
    }
    this.init$$.next(true);
  }

  smev2Loading(): void {
    this.label = this.screenService.component?.label;
    const value = this.jsonHelperService.tryToParse(
      this.screenService.component?.value,
    ) as TimeSlotValueInterface;

    const type = value.timeSlotType as TimeSlotsTypes;
    this.initServiceVariables(value);
    this.timeSlotType = type;
    this.timeSlotsService.smev2Init(value, this.cachedAnswer, type);
    this.serviceInitHandle(false);
    this.changeDetectionRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.httpCancelService.cancelPendingRequests();
  }

  /**
   * Проверяет есть ли в текущем месяце пустые слоты
   * Если да, to this.isExistsSlots = true
   * Функция вызывается при каждой регенерации календаря
   */
  public checkExistenceSlots(): void {
    if (!this.isSmev2) {
      this.isExistsSlots = this.weeks.some((week) => {
        return week.some((day) => {
          return !this.isDateLocked(day.date, this.firstDayOfMainSection, this.daysInMainSection);
        });
      });
    }
  }

  public isToday(date: Date): boolean {
    return (
      date.getUTCFullYear() === this.today.getUTCFullYear() &&
      date.getUTCMonth() === this.today.getUTCMonth() &&
      date.getUTCDate() === this.today.getUTCDate()
    );
  }

  public isSelected(date: Date): boolean {
    return this.datesHelperService.isSameDate(date, this.date);
  }

  public isDateOutOfMonth(date: Date): boolean {
    return date && this.datesHelperService.getMonth(date) !== this.activeMonthNumber;
  }

  public isDateLocked(date: Date, firstDayOfMainSection: Date, daysInMainSection: number): boolean {
    if (this.isSmev2) {
      return (
        this.datesHelperService.isAfter(this.datesHelperService.addDays(this.today, 1), date) ||
        this.isDateOutOfSection(date, firstDayOfMainSection, daysInMainSection) ||
        this.checkDateRestrictions(date)
      );
    }
    return (
      this.isDateOutOfSection(date, firstDayOfMainSection, daysInMainSection) ||
      this.timeSlotsService.isDateLocked(date, this.currentArea?.id) ||
      this.checkDateRestrictions(date)
    );
  }

  /**
   * Клик по дню на календаре. Повторный клик по уже выбранному дню отменяет выбор
   * @param date день для выбора
   */
  public selectDate(date: Date): void {
    if (this.isDateLocked(date, this.firstDayOfMainSection, this.daysInMainSection)) {
      return;
    }
    if (this.date?.toISOString() === date.toISOString()) {
      this.clearDateSelection();
    } else {
      this.date = date;
      this.recalcDaysStyles();
      this.showTimeSlots(date);
    }
  }

  /**
   * Клик по слоту на календаре. Повторный клик по уже выбранному слоту отменяет выбор
   * @param slot слот для выбора
   */
  public chooseTimeSlot(slot: SlotInterface): void {
    if (this.currentSlot?.slotId === slot.slotId) {
      this.clearTimeSlotSelection();
    } else {
      this.currentSlot = slot;
      if (this.isSmev2) {
        this.currentAnswersService.state = this.timeSlotsService.smev2CacheItems[slot.slotId];
      } else {
        this.currentAnswersService.state = slot;
      }
    }
  }

  public isSlotSelected({ slotId }: SlotInterface): boolean {
    return this.currentSlot && this.currentSlot.slotId === slotId;
  }

  public showTimeSlots(date: Date): void {
    this.currentSlot = null;
    if (this.isSmev2) {
      this.dateSelector$$.next(date);
    } else {
      this.timeSlotsService.getAvailableSlots(date, this.currentArea?.id).subscribe(
        (timeSlots) => {
          this.addBookedTimeSlotToList(timeSlots);
          this.timeSlots = timeSlots;
          if (this.timeSlotsService.hasError()) {
            this.showError(
              `${
                this.constants.errorLoadingTimeSlots
              } (${this.timeSlotsService.getErrorMessage()})`,
            );
          }
          this.changeDetectionRef.markForCheck();
        },
        () => {
          this.showError(
            `${this.constants.errorLoadingTimeSlots}  (${this.timeSlotsService.getErrorMessage()})`,
          );
          this.changeDetectionRef.markForCheck();
        },
      );
    }
  }

  public areaChanged(): void {
    this.clearDateSelection();
    this.checkExistenceSlots();
    this.recalcDaysStyles();
  }

  public monthChanged(ev: ListItem): void {
    const { id } = ev;
    const [activeYear, activeMonth] = (id as string).split('-');

    this.activeMonthNumber = parseInt(activeMonth, 10) - 1;
    this.activeYearNumber = parseInt(activeYear, 10);
    this.renderSingleMonthGrid(this.weeks);
    this.checkExistenceSlots();
  }

  nextSmev2(): void {
    this.actionService.switchAction(this.nextStepAction, this.screenService.component.id);
  }

  getConfirmModalParams(): ConfirmationModal {
    const time = this.datesHelperService.format(this.currentSlot.slotTime, DATE_TIME_STRING_FULL);
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

  /**
   * Отправка формы.
   *  Если есть забуканный слот
   *
   *      и значение не менялось то передаем ответ из cachedAnswers.
   *      и значение менялось, то модалка для подтверждения
   *
   *  Иначе, букаем слот
   */
  public clickSubmit(): void {
    if (this.isSmev2) {
      this.showModal(this.getConfirmModalParams());
      return;
    }
    if (this.bookedSlot) {
      if (this.isCachedValueChanged()) {
        this.showModal(this.confirmModalParameters);
      } else {
        this.currentAnswersService.state = this.cachedAnswer;
        this.actionService.switchAction(this.nextStepAction, this.screenService.component.id);
      }
    } else {
      this.bookTimeSlot();
    }
  }

  public bookTimeSlot(): void {
    this.inProgress = true;
    this.timeSlotsService.checkBooking(this.currentSlot).subscribe(
      (response) => {
        if (this.timeSlotsService.hasError()) {
          this.errorMessage = this.timeSlotsService.getErrorMessage();
          this.showCustomError(this.errorMessage);
        } else {
          this.inProgress = false;
          const answer = {
            ...response,
            department: this.timeSlotsService.department,
          };
          this.setBookedTimeStr(this.currentSlot);
          this.currentAnswersService.state = answer;
          this.actionService.switchAction(this.nextStepAction, this.screenService.component.id);
          this.changeDetectionRef.markForCheck();
        }
      },
      (result) => {
        this.inProgress = false;
        this.showCustomError(result?.error?.errorDetail?.errorMessage);
        this.changeDetectionRef.markForCheck();
      },
    );
  }

  showCustomError(error: string | undefined): void {
    if (error != null) {
      if (this.errorMessage.includes(SMEV2_SERVICE_OR_SPEC_SESSION_TIMEOUT)) {
        this.showModal(SERVICE_OR_SPEC_SESSION_TIMEOUT)
          .toPromise()
          .then((value) => {
            if (value) {
              this.formPlayer.initData();
            }
          });
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
        const message = this.errorMessage
          .replace('FAILURE:', '')
          .replace('UNKNOWN_REQUEST_DESCRIPTION:', '')
          .replace('NO_DATA:', '');
        params.text = params.text.replace(/\{textAsset\}?/g, message);
        this.showModal(params)
          .toPromise()
          .then((result) => {
            if (result) {
              this.formPlayer.initData();
            }
          });
      }
    }
  }

  showError(errorMessage: string): void {
    this.errorModalResultSub.unsubscribe();
    const params = {
      ...COMMON_ERROR_MODAL_PARAMS,
      buttons: [
        {
          label: 'Попробовать ещё раз',
          closeModal: true,
          value: errorMessage,
        },
      ],
    };
    const errorModalResult$ = this.showModal(params);

    this.errorModalResultSub = errorModalResult$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((result) => {
        if (result) {
          this.loadTimeSlots();
        }
        this.changeDetectionRef.markForCheck();
      });
  }

  showModal(params: ConfirmationModal): Observable<string> {
    return this.modalService.openModal(ConfirmationModalComponent, {
      ...params,
    });
  }

  buttonDisabled(): boolean {
    return !this.currentAnswersService.isValid || this.inProgress || !this.currentSlot?.slotId;
  }

  isBookSlotSelected(): string {
    return this.currentSlot?.slotId;
  }

  calendarAvailable(): boolean {
    return !this.errorMessage;
  }

  // TODO
  // eslint-disable-next-line @typescript-eslint/typedef
  renderSingleMonthGrid(output): void {
    output.splice(0, output.length); // in-place clear
    const daysToShow = this.screenService.component?.attrs.daysToShow;

    if (this.screenService.component?.attrs.startSection === 'today') {
      this.firstDayOfMainSection = this.today;
    } else {
      this.firstDayOfMainSection = this.datesHelperService.setCalendarDate(
        this.today,
        this.activeYearNumber,
        this.activeMonthNumber,
        1,
      );
    }

    const firstDate = this.datesHelperService.startOfISOWeek(this.firstDayOfMainSection);

    this.daysInMainSection =
      daysToShow || this.datesHelperService.getDaysInMonth(this.firstDayOfMainSection);

    const lastDate = this.datesHelperService.endOfISOWeek(
      this.datesHelperService.add(this.firstDayOfMainSection, this.daysInMainSection - 1, 'days'),
    );

    const totalDays = this.datesHelperService.differenceInCalendarDays(firstDate, lastDate);

    let date = firstDate;
    let week = 0;
    output.push([]);
    for (let i = 0; i <= totalDays; i += 1) {
      if (output[week].length && output[week].length % 7 === 0) {
        week += 1;
        output.push([]);
      }
      this.addDayToWeek(output[week], date, this.today);
      date = this.datesHelperService.add(date, 1, 'days');
    }
  }

  private setCancelReservation(currentTimeSlotId: string, cancelReservation: string[]): void {
    this.timeSlotsService.cancelReservation = [currentTimeSlotId, ...(cancelReservation || [])];
  }

  private loadTimeSlots(): void {
    this.inProgress = true;
    this.label = this.screenService.component?.label;
    const value = JSON.parse(this.screenService.component?.value);

    this.initServiceVariables(value);
    this.timeSlotType = value.timeSlotType;

    this.timeSlotsService.init(value, this.cachedAnswer, value.timeSlotType).subscribe(
      (isBookedDepartment) => {
        if (this.timeSlotsService.hasError()) {
          this.inProgress = false;
          this.errorMessage = this.timeSlotsService.getErrorMessage();
          if (this.errorMessage === 101) {
            this.errorMessage = `${this.errorMessage}: ${this.constants.error101ServiceUnavailable}`;
          }
          if (this.errorMessage?.includes(STATIC_ERROR_MESSAGE)) {
            this.daysNotFoundTemplate.header = 'Непредвиденная ошибка';
            this.daysNotFoundTemplate.description = this.errorMessage;
          } else if (this.screenService.component.attrs.slotsNotFoundTemplate) {
            this.daysNotFoundTemplate.header = '';
            this.daysNotFoundTemplate.description = '';
          } else if (this.errorMessage?.includes(NO_DATA_MESSAGE)) {
            this.daysNotFoundTemplate.header = 'Нет свободного времени для приёма';
            this.daysNotFoundTemplate.description = `Этот врач занят на ближайшие 14 дней. Выберите другого специалиста`;
          } else if (this.errorMessage.includes('Закончилось время')) {
            this.showModal(SERVICE_OR_SPEC_SESSION_TIMEOUT)
              .toPromise()
              .then((result) => {
                if (result) {
                  this.formPlayer.initData();
                }
              });
          } else {
            this.showError(`${this.constants.errorInitialiseService} (${this.errorMessage})`);
          }
        } else {
          this.serviceInitHandle(!!isBookedDepartment);
        }

        this.inProgress = false;

        this.checkExistenceSlots();

        if (!this.isExistsSlots && this.emptySlotsModal && !this.timeSlotsService.hasError()) {
          this.showModal(this.emptySlotsModal);
        }

        this.changeDetectionRef.detectChanges();
      },
      (error) => {
        this.errorMessage = this.timeSlotsService.getErrorMessage();
        this.inProgress = false;
        this.showError(
          `${this.constants.errorInitialiseService} (${this.errorMessage}) (${error})`,
        );

        this.changeDetectionRef.markForCheck();
      },
    );
  }

  private addBookedTimeSlotToList(timeSlots: SlotInterface[]): void {
    if (
      this.bookedSlot &&
      timeSlots.length &&
      this.datesHelperService.isSameDate(this.bookedSlot.slotTime, timeSlots[0].slotTime)
    ) {
      const bookedSlotTime = this.bookedSlot.slotTime?.getTime();
      const insertIdx = timeSlots.findIndex((timeSlot, idx) => {
        const prevSlotTime = timeSlots[idx - 1]?.slotTime?.getTime();
        const currentSlotTime = timeSlot.slotTime?.getTime();
        return prevSlotTime
          ? bookedSlotTime > prevSlotTime && bookedSlotTime < currentSlotTime
          : bookedSlotTime < currentSlotTime;
      });
      if (insertIdx !== -1) {
        timeSlots.splice(insertIdx, 0, this.bookedSlot);
      } else {
        timeSlots.push(this.bookedSlot);
      }
    }
  }

  private addDayToWeek(week: IDay[], date: Date, today: Date): void {
    const isOutOfSection = this.isDateOutOfSection(
      date,
      this.firstDayOfMainSection,
      this.daysInMainSection,
    );
    const isOutOfMonth = this.isDateOutOfMonth(date);
    const month = this.datesHelperService.getMonth(date);
    if (isOutOfMonth && !isOutOfSection) {
      this.visibleMonths[month] = true;
    }
    // Заполняем список месяцев в шапке календаря
    if (!isOutOfSection) {
      const monthName = this.datesHelperService.format(date, 'LLLL');
      this._monthsRange.add(monthName.charAt(0).toUpperCase() + monthName.slice(1));
    }

    week.push({
      number: this.datesHelperService.getDate(date),
      date,
      classes: this.getDateStyles(today, date),
    });
  }

  private getDateStyles(today: Date, date: Date): { [key: string]: boolean } {
    const month = this.datesHelperService.getMonth(date);
    const isOutOfSection = this.isDateOutOfSection(
      date,
      this.firstDayOfMainSection,
      this.daysInMainSection,
    );
    const isOutOfMonth = this.isDateOutOfMonth(date);
    return {
      'is-past': this.datesHelperService.differenceInCalendarDays(today, date) < 0,
      today: this.isToday(date),
      locked: this.isDateLocked(date, this.firstDayOfMainSection, this.daysInMainSection),
      selected: this.isSelected(date),
      'outer-month': isOutOfMonth,
      'outer-section': isOutOfSection,
      visible: this.visibleMonths[month] || false,
    };
  }

  private recalcDaysStyles(): void {
    this.weeks = this.weeks.map((week) => {
      return week.map((day) => {
        const newDay = { ...day };
        newDay.classes = this.getDateStyles(this.today, newDay.date);
        return newDay;
      });
    });
  }

  private getMonthsListItem(monthYear: string): ListItem {
    const [activeYear, activeMonth] = monthYear.split('-');
    const monthNumber = parseInt(activeMonth, 10) - 1;
    const yearNumber = parseInt(activeYear, 10);
    return new ListItem({
      id: `${monthYear}`,
      text: `${this.months[monthNumber]} ${yearNumber}`,
    });
  }

  private getRefDate(): Date {
    const dateType = this.screenService.component?.attrs?.dateType || DateTypeTypes.TODAY;
    const refDateAttr = this.screenService.component?.attrs?.refDate;

    // TODO избавиться от Date.now, переделать на DatesToolsService.getToday()
    if (dateType === DateTypeTypes.TODAY) {
      return new Date(this.today || Date.now());
    }

    if (dateType === DateTypeTypes.REF_DATE && refDateAttr) {
      return new Date(refDateAttr);
    }

    throw Error(`dateType has incorrect value "${dateType}" or missed refDate attr in json`);
  }

  /**
   * Проверяет дату по ограничениям на валидность
   * @param {Date} date дата для валидации
   * @param startType тип обрезания даты, например, до начала дня ('day'), до начала месяца ('month')
   * @returns {boolean} false - дата прошла проверки. true - дата инвалидна
   */
  private checkDateRestrictions(date: Date, startType: StartOfTypes = 'day'): boolean {
    const refDate = this.datesHelperService.startOf(this.getRefDate(), startType);

    const restrictions = this.screenService.component?.attrs?.restrictions || {};
    // Объект с функциями проверки дат на заданные ограничения
    const checks = {
      minDate: (amount, type): boolean => {
        let expectedBefore = this.datesHelperService.add(refDate, amount, type);
        expectedBefore = this.datesHelperService.startOf(expectedBefore, startType);
        return this.datesHelperService.isBefore(date, expectedBefore);
      },
      maxDate: (amount, type): boolean => {
        let expectedAfter = this.datesHelperService.add(refDate, amount, type);
        expectedAfter = this.datesHelperService.startOf(expectedAfter, startType);
        return this.datesHelperService.isAfter(date, expectedAfter);
      },
    };
    // Перебираем все ключи restrictions из attrs до первого "плохого"
    // пример: "minDate": [30, "d"],
    return Object.keys(restrictions).some((key) => {
      const [amount, type] = restrictions[key];
      return checks[key](amount, type);
    });
  }

  private isCachedValueChanged(): boolean {
    const slotIdFromAnswer = this.cachedAnswer?.timeSlot.slotId;
    return slotIdFromAnswer !== this.currentSlot.slotId;
  }

  /**
   * Создается и заполняет массив для выпадающего списка месяцев
   * Месяцы создаются от минимального до максимального из эндпоинта самих слотов
   */
  private fillMonthsYears(): void {
    this.monthsYears = [];

    const availableMonths = this.isSmev2
      ? this.datesHelperService.getMonthListByYear(this.today)
      : this.timeSlotsService.getAvailableMonths();

    if (availableMonths.length) {
      availableMonths.sort((date1: string, date2: string): number => {
        return new Date(date1) > new Date(date2) ? 1 : -1;
      });
      const firstMonthStr = availableMonths[0];
      const lastMonthStr = availableMonths[availableMonths.length - 1];
      for (
        let month = this.datesHelperService.parse(firstMonthStr, DATE_STRING_YEAR_MONTH);
        !this.datesHelperService.isAfter(
          month,
          this.datesHelperService.parse(lastMonthStr, DATE_STRING_YEAR_MONTH),
        );
        month = this.datesHelperService.add(month, 1, 'months')
      ) {
        const monthForDropdown = this.getMonthsListItem(
          this.datesHelperService.format(month, DATE_STRING_YEAR_MONTH),
        );
        if (
          !availableMonths.includes(
            this.datesHelperService.format(month, DATE_STRING_YEAR_MONTH),
          ) ||
          this.checkDateRestrictions(this.datesHelperService.toDate(month), 'month')
        ) {
          monthForDropdown.unselectable = true;
        }
        // Чтобы в начале списка не было "серых" месяцев
        if (!monthForDropdown.unselectable || this.monthsYears.length) {
          this.monthsYears.push(monthForDropdown);
        }
      }
      if (this.currentMonth) {
        this.currentMonth = this.monthsYears.find(({ id }) => id === this.currentMonth.id);
      } else {
        this.currentMonth = this.monthsYears[0] as ListItem;
      }
    }
  }

  /**
   * Устанавливает забуканный слот при его наличие, иначе пытается его проставить из кэша ответов
   * @param timeSlot таймслот из кэша
   */
  private setBookedSlot(timeSlot: TimeSlot, waitingTimeExpired: boolean): void {
    this.timeSlotsService.waitingTimeExpired = waitingTimeExpired;
    let bookedSlot = this.timeSlotsService.getBookedSlot();
    if (!bookedSlot && timeSlot) {
      bookedSlot = {
        slotId: timeSlot.slotId,
        slotTime: new Date(timeSlot.visitTimeISO),
        timezone: timeSlot.visitTimeISO.substr(-6),
        areaId: timeSlot.areaId,
      };
      this.timeSlotsService.setBookedSlot(bookedSlot);
      this.timeSlotsService.bookId = this.cachedAnswer.bookId;
    }

    this.bookedSlot = waitingTimeExpired ? null : bookedSlot;
  }

  private setBookedTimeStr(slot: SlotInterface): void {
    const time = this.datesHelperService.utcOffset(slot.slotTime, slot.timezone);

    this.chosenTimeStr = this.datesHelperService.format(time, DATE_TIME_STRING_FULL);
  }

  /**
   * Метод очищает выбранные в календаре день и время
   */
  private clearDateSelection(): void {
    this.date = null;
    this.timeSlots = null;
    this.clearTimeSlotSelection();
    this.recalcDaysStyles();
  }

  /**
   * Метод очищает выбранное в календаре время
   */
  private clearTimeSlotSelection(): void {
    this.currentSlot = null;
    this.currentAnswersService.state = null;
  }

  /**
   * Инициализирует атрибуты сервиса
   * @param componentValue value из компонента из display
   */
  private initServiceVariables(componentValue: TimeSlotValueInterface): void {
    const timeSlotFromCache = this.cachedAnswer?.timeSlot;
    // waitingTimeExpired - Флаг просрочки бронирования
    const { waitingTimeExpired } = componentValue;

    this.setBookedSlot(timeSlotFromCache, waitingTimeExpired);
    if (this.bookedSlot) {
      this.setBookedTimeStr(this.bookedSlot);
    }
  }

  /**
   * Обработка инициализации текущего сервиса
   * @param isBookedDepartment Флаг показывающий что выбран департамент, на который уже есть бронь
   */
  private serviceInitHandle(isBookedDepartment: boolean): void {
    this.isChosenTimeStrVisible = isBookedDepartment && !!this.bookedSlot;
    this.errorMessage = undefined;
    this.activeMonthNumber = this.timeSlotsService.getCurrentMonth();
    this.activeYearNumber = this.timeSlotsService.getCurrentYear();
    this.initSlotsAreas();

    this.fillMonthsYears();
    this.fixedMonth = this.monthsYears.length < 2;
    if (this.currentMonth) {
      this.monthChanged(this.currentMonth);
    }

    if (this.bookedSlot && isBookedDepartment) {
      this.selectDate(this.bookedSlot.slotTime);
      this.chooseTimeSlot(this.bookedSlot);
    }

    if (this.isSmev2) {
      this.changeDetectionRef.markForCheck();
    }
  }

  private initSlotsAreas(): void {
    if ([TimeSlotsTypes.BRAK, TimeSlotsTypes.RAZBRAK].includes(this.timeSlotType)) {
      this.areas = this.timeSlotsService.getAreasListItems();
      [this.currentArea] = this.areas;
      this.isAreasVisible = this.areas.length > 0;
    }
  }

  private initModalsSettings(): void {
    this.emptySlotsModal = this.screenService.component.attrs?.emptySlotsModal;
  }

  private isDateOutOfSection(
    date: Date,
    firstDayOfMainSection: Date,
    daysInMainSection: number,
  ): boolean {
    const diff = this.datesHelperService.differenceInCalendarDays(firstDayOfMainSection, date);
    return diff < 0 || diff >= daysInMainSection;
  }

  private initSettings(): void {
    this.isMonthsRangeVisible = this.screenService.component.attrs?.isMonthsRangeVisible;
  }
}
