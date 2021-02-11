import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ListItem } from 'epgu-lib';
import { Observable, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { COMMON_ERROR_MODAL_PARAMS } from '../../../../core/interceptor/errors/errors.interceptor.constants';
import { HttpCancelService } from '../../../../core/interceptor/http-cancel/http-cancel.service';
import { DatesToolsService } from '../../../../core/services/dates-tools/dates-tools.service';
import { EventBusService } from '../../../../core/services/event-bus/event-bus.service';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';
import { DisplayDto } from '../../../../form-player/services/form-player-api/form-player-api.types';
import { ConfirmationModalComponent } from '../../../../modal/confirmation-modal/confirmation-modal.component';
import { ConfirmationModal } from '../../../../modal/confirmation-modal/confirmation-modal.interface';
import { ModalService } from '../../../../modal/modal.service';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { ScreenService } from '../../../../screen/screen.service';
import { months, StartOfTypes, weekDaysAbbr } from '../../../../shared/constants/dates';
import { DateTypeTypes, TimeSlotsConstants, TimeSlotsTypes } from './time-slots.constants';
import { TimeSlotsService } from './time-slots.service';
import {
  SlotInterface,
  TimeSlot,
  TimeSlotsAnswerInterface,
  TimeSlotValueInterface,
} from './time-slots.types';

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

  public date: Date = null;
  public label: string;
  public activeMonthNumber: number;
  public activeYearNumber: number;
  public chosenTimeStr: string;
  public isChosenTimeStrVisible = false;

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

  public weeks = [];
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

  private errorModalResultSub = new Subscription();
  private cachedAnswer: TimeSlotsAnswerInterface;
  private timeSlotType: TimeSlotsTypes;

  constructor(
    private modalService: ModalService,
    private currentAnswersService: CurrentAnswersService,
    public constants: TimeSlotsConstants,
    private ngUnsubscribe$: UnsubscribeService,
    public screenService: ScreenService,
    private eventBusService: EventBusService,
    private changeDetectionRef: ChangeDetectorRef,
    private datesHelperService: DatesToolsService,
    private httpCancelService: HttpCancelService,
    private timeSlotsService: TimeSlotsService,
  ) {}

  ngOnInit(): void {
    const cachedAnswer = this.screenService.getCompValueFromCachedAnswers();
    if (cachedAnswer) {
      this.cachedAnswer = JSON.parse(cachedAnswer);
    }

    if (this.screenService.component) {
      this.loadTimeSlots();
    }
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
    this.isExistsSlots = this.weeks.some((week) => {
      return week.some((day) => {
        return !this.isDateLocked(day.date);
      });
    });
  }

  public isToday(date: Date): boolean {
    return this.datesHelperService.isToday(date);
  }

  public isSelected(date: Date): boolean {
    return this.datesHelperService.isSameDate(date, this.date);
  }

  public isDateOutOfMonth(date: Date): boolean {
    return date && this.datesHelperService.getMonth(date) !== this.activeMonthNumber;
  }

  public isDateLocked(date: Date): boolean {
    return (
      this.isDateOutOfMonth(date) ||
      this.timeSlotsService.isDateLocked(date, this.currentArea?.id) ||
      this.checkDateRestrictions(date)
    );
  }

  /**
   * Клик по дню на календаре. Повторный клик по уже выбранному дню отменяет выбор
   * @param date день для выбора
   */
  public selectDate(date: Date): void {
    if (this.isDateLocked(date) || this.isDateOutOfMonth(date)) {
      return;
    }
    if (this.date?.toISOString() === date.toISOString()) {
      this.clearDateSelection();
    } else {
      this.date = date;
      this.showTimeSlots(date);
    }
  }

  /**
   * Клик по слоту на календаре. Повторный клик по уже выбранному слоту отменяет выбор
   * @param slot слот для выбора
   */
  public chooseTimeSlot(slot: SlotInterface): void {
    if (this.currentSlot?.slotId === slot.slotId) {
      this.clearDateSelection();
    } else {
      this.currentSlot = slot;
      this.currentAnswersService.state = slot;
    }
  }

  public isSlotSelected({ slotId }: SlotInterface): boolean {
    return this.currentSlot && this.currentSlot.slotId === slotId;
  }

  public showTimeSlots(date: Date): void {
    this.currentSlot = null;
    this.timeSlotsService.getAvailableSlots(date).subscribe(
      (timeSlots) => {
        this.timeSlots = timeSlots;
        if (this.timeSlotsService.hasError()) {
          this.showError(
            `${this.constants.errorLoadingTimeSlots} (${this.timeSlotsService.getErrorMessage()})`,
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

  public areaChanged(): void {
    this.clearDateSelection();
    this.checkExistenceSlots();
  }

  public monthChanged(ev: ListItem): void {
    const { id } = ev;
    const [activeYear, activeMonth] = (id as string).split('-');
    this.activeMonthNumber = parseInt(activeMonth, 10) - 1;
    this.activeYearNumber = parseInt(activeYear, 10);
    this.renderSingleMonthGrid(this.weeks);
    this.checkExistenceSlots();
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
    if (this.bookedSlot) {
      if (this.isCachedValueChanged()) {
        this.showModal(this.confirmModalParameters);
      } else {
        this.eventBusService.emit('nextStepEvent', JSON.stringify(this.cachedAnswer));
      }
    } else {
      this.bookTimeSlot();
    }
  }

  public bookTimeSlot(): void {
    this.inProgress = true;
    this.timeSlotsService.checkBooking(this.currentSlot).subscribe(
      (response) => {
        this.inProgress = false;
        if (this.timeSlotsService.hasError()) {
          this.showError(
            `${this.constants.errorFailBookTimeSlot}  (${this.timeSlotsService.getErrorMessage()})`,
          );
          return;
        }
        const answer = {
          ...response,
          department: this.timeSlotsService.department,
        };
        this.setBookedTimeStr(this.currentSlot);
        this.eventBusService.emit('nextStepEvent', JSON.stringify(answer));
        this.changeDetectionRef.markForCheck();
      },
      () => {
        this.inProgress = false;
        this.showModal(COMMON_ERROR_MODAL_PARAMS);
        this.changeDetectionRef.markForCheck();
      },
    );
  }

  showError(errorMessage: string): void {
    const params = this.constants.errorModal;
    params.text = errorMessage;
    params.buttons = [
      {
        label: 'Попробовать ещё раз',
        closeModal: true,
        value: 'ok',
      },
    ];
    this.errorModalResultSub.unsubscribe();
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
    return !this.currentAnswersService.isValid || this.inProgress || !this.isBookSlotSelected();
  }

  isBookSlotSelected(): string {
    return this.currentSlot?.slotId;
  }

  calendarAvailable(): boolean {
    return !this.errorMessage;
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
          this.showError(`${this.constants.errorInitialiseService} (${this.errorMessage})`);
        } else {
          this.serviceInitHandle(!!isBookedDepartment);
        }

        this.inProgress = false;

        this.checkExistenceSlots();

        this.changeDetectionRef.markForCheck();
      },
      () => {
        this.errorMessage = this.timeSlotsService.getErrorMessage();
        this.inProgress = false;
        this.showError(`${this.constants.errorInitialiseService} (${this.errorMessage})`);

        this.changeDetectionRef.markForCheck();
      },
    );
  }

  // TODO
  // eslint-disable-next-line @typescript-eslint/typedef
  private renderSingleMonthGrid(output): void {
    output.splice(0, output.length); // in-place clear

    let firstDayOfMonth = new Date(Date.now());
    firstDayOfMonth = this.datesHelperService.setCalendarDate(
      firstDayOfMonth,
      this.activeYearNumber,
      this.activeMonthNumber,
    );
    firstDayOfMonth = this.datesHelperService.startOfMonth(firstDayOfMonth);
    firstDayOfMonth = this.datesHelperService.startOfDay(firstDayOfMonth);

    const firstDayOfWeekInMonth = this.datesHelperService.getISODay(firstDayOfMonth);
    const daysInMonth = this.datesHelperService.getDaysInMonth(firstDayOfMonth);
    let week = 0;
    output.push([]);
    if (firstDayOfWeekInMonth > 1) {
      for (let i = 1; i < firstDayOfWeekInMonth; i += 1) {
        const date = this.datesHelperService.add(
          firstDayOfMonth,
          i - firstDayOfWeekInMonth,
          'days',
        );

        output[0].push({
          number: this.datesHelperService.getDate(date),
          date: this.datesHelperService.toDate(date),
        });
      }
    }
    for (let i = 0; i < daysInMonth; i += 1) {
      if (output[week].length && output[week].length % 7 === 0) {
        week += 1;
        output.push([]);
      }
      const date = this.datesHelperService.add(firstDayOfMonth, i, 'days');
      output[week].push({
        number: this.datesHelperService.getDate(date),
        date: this.datesHelperService.toDate(date),
      });
    }
    let days = 0;
    while (output[week].length < 7) {
      let date = this.datesHelperService.add(firstDayOfMonth, 1, 'months');
      date = this.datesHelperService.add(date, days, 'days');
      days += 1;
      output[week].push({
        number: this.datesHelperService.getDate(date),
        date: this.datesHelperService.toDate(date),
      });
    }
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

    if (dateType === DateTypeTypes.TODAY) {
      return new Date(Date.now());
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
    const availableMonths = this.timeSlotsService.getAvailableMonths();
    if (availableMonths.length) {
      availableMonths.sort((date1: string, date2: string): number => {
        return new Date(date1) > new Date(date2) ? 1 : -1;
      });
      const firstMonthStr = availableMonths[0];
      const lastMonthStr = availableMonths[availableMonths.length - 1];
      for (
        let month = this.datesHelperService.parse(firstMonthStr, 'yyyy-MM');
        !this.datesHelperService.isAfter(
          month,
          this.datesHelperService.parse(lastMonthStr, 'yyyy-MM'),
        );
        month = this.datesHelperService.add(month, 1, 'months')
      ) {
        const monthForDropdown = this.getMonthsListItem(
          this.datesHelperService.format(month, 'yyyy-MM'),
        );
        if (
          !availableMonths.includes(this.datesHelperService.format(month, 'yyyy-MM')) ||
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

    this.chosenTimeStr = this.datesHelperService.format(time, 'd MMMM yyyy года в HH:mm, eeee');
  }

  /**
   * Метод очищает выбранные на календаре день и время
   */
  private clearDateSelection(): void {
    this.date = null;
    this.currentSlot = null;
    this.currentAnswersService.state = null;
    this.timeSlots = null;
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
  }

  private initSlotsAreas(): void {
    if (this.timeSlotType === TimeSlotsTypes.BRAK) {
      this.areas = this.timeSlotsService.getAreasListItems();
      [this.currentArea] = this.areas;
      this.isAreasVisible = this.areas.length > 0;
    }
  }
}
