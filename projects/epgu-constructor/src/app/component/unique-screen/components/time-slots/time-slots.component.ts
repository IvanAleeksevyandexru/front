import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ListItem } from 'epgu-lib';
import * as moment_ from 'moment';
import { Observable, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { COMMON_ERROR_MODAL_PARAMS } from '../../../../core/interceptor/errors/errors.interceptor.constants';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';
import { DisplayDto } from '../../../../form-player/services/form-player-api/form-player-api.types';
import { ConfirmationModalComponent } from '../../../../modal/confirmation-modal/confirmation-modal.component';
import { ConfirmationModal } from '../../../../modal/confirmation-modal/confirmation-modal.interface';
import { ModalService } from '../../../../modal/modal.service';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { ScreenService } from '../../../../screen/screen.service';
import { months, weekDaysAbbr } from '../../../../shared/constants/dates';
import { BrakTimeSlotsService } from './brak-time-slots.service';
import { DivorceTimeSlotsService } from './divorce-time-slots.service';
import { GibddTimeSlotsService } from './gibdd-time-slots.service';
import { MvdTimeSlotsService } from './mvd-time-slots.service';
import { TimeSlotsConstants } from './time-slots.constants';
import { TimeSlotsServiceInterface } from './time-slots.interface';
import {
  SlotInterface,
  TimeSlot,
  TimeSlotsAnswerInterface,
  TimeSlotValueInterface,
} from './time-slots.types';

const moment = moment_;
moment.locale('ru');

@Component({
  selector: 'epgu-constructor-time-slots',
  templateUrl: './time-slots.component.html',
  styleUrls: ['./time-slots.component.scss'],
  providers: [UnsubscribeService],
})
export class TimeSlotsComponent implements OnInit {
  @Output() nextStepEvent = new EventEmitter();
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
  public monthsYears: ListItem[] = [];
  public timeSlots: SlotInterface[] = [];
  public dialogButtons = [];
  public isExistsSlots = true;
  public currentSlot: SlotInterface;
  public currentMonth: ListItem;
  public blockMobileKeyboard = false;
  public fixedMonth = false;
  public inProgress = false;
  public changeTSConfirm = false;
  bookedSlot: SlotInterface;
  errorMessage;

  private timeSlotServices: { [key: string]: TimeSlotsServiceInterface } = {};
  private currentService: TimeSlotsServiceInterface;
  private errorModalResultSub = new Subscription();
  private cachedAnswer: TimeSlotsAnswerInterface;

  constructor(
    private brakTimeSlotsService: BrakTimeSlotsService,
    private divorceTimeSlotsService: DivorceTimeSlotsService,
    private gibddTimeSlotsService: GibddTimeSlotsService,
    private mvdTimeSlotsService: MvdTimeSlotsService,
    private modalService: ModalService,
    private currentAnswersService: CurrentAnswersService,
    public constants: TimeSlotsConstants,
    private ngUnsubscribe$: UnsubscribeService,
    public screenService: ScreenService,
  ) {
    this.timeSlotServices.BRAK = this.brakTimeSlotsService;
    this.timeSlotServices.RAZBRAK = this.divorceTimeSlotsService;
    this.timeSlotServices.GIBDD = this.gibddTimeSlotsService;
    this.timeSlotServices.MVD = this.mvdTimeSlotsService;
  }

  ngOnInit(): void {
    const cachedAnswer = this.screenService.getCompValueFromCachedAnswers();
    if (cachedAnswer) {
      this.cachedAnswer = JSON.parse(cachedAnswer);
    }

    if (this.screenService.component) {
      this.loadTimeSlots();
    }
  }

  /**
   * Проверяет есть ли в текущем месяце пустые слоты
   * Если да, to this.isExistsSlots = true
   * Функция вызывается при каждой регенерации календаря
   */
  public checkExistenceSlots(): void {
    let isExistsSlots = false;
    this.weeks.forEach((week) => {
      week.forEach((day) => {
        if (!this.isDateLocked(day.date)) {
          isExistsSlots = true;
        }
      });
    });
    this.isExistsSlots = isExistsSlots;
  }

  public isToday(date: Date): boolean {
    return date && moment().isSame(moment(date), 'day');
  }

  public isSelected(date: Date): boolean {
    return date && moment(date).isSame(this.date, 'day');
  }

  public isDateOutOfMonth(date: Date): boolean {
    return date && moment(date).month() !== this.activeMonthNumber;
  }

  public isDateLocked(date: Date): boolean {
    return (
      this.isDateOutOfMonth(date) ||
      this.currentService.isDateLocked(date) ||
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
    this.currentService.getAvailableSlots(date).subscribe(
      (timeSlots) => {
        this.timeSlots = timeSlots;
        if (this.currentService.hasError()) {
          this.showError(
            `${this.constants.errorLoadingTimeSlots} (${this.currentService.getErrorMessage()})`,
          );
        }
      },
      () => {
        this.showError(
          `${this.constants.errorLoadingTimeSlots}  (${this.currentService.getErrorMessage()})`,
        );
      },
    );
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
        this.nextStepEvent.emit(JSON.stringify(this.cachedAnswer));
      }
    } else {
      this.bookTimeSlot();
    }
  }

  public bookTimeSlot(): void {
    this.inProgress = true;
    this.currentService.checkBooking(this.currentSlot).subscribe(
      (response) => {
        this.inProgress = false;
        if (this.currentService.hasError()) {
          this.showError(
            `${this.constants.errorFailBookTimeSlot}  (${this.currentService.getErrorMessage()})`,
          );
          return;
        }
        const answer = {
          ...response,
          department: this.currentService.department,
        };
        this.setBookedTimeStr(this.currentSlot);
        this.nextStepEvent.emit(JSON.stringify(answer));
      },
      () => {
        this.inProgress = false;
        this.showModal(COMMON_ERROR_MODAL_PARAMS);
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

    this.currentService.init(value, this.cachedAnswer).subscribe(
      (isBookedDepartment) => {
        if (this.currentService.hasError()) {
          this.inProgress = false;
          this.errorMessage = this.currentService.getErrorMessage();
          if (this.errorMessage === 101) {
            this.errorMessage = `${this.errorMessage}: ${this.constants.error101ServiceUnavailable}`;
          }
          this.showError(`${this.constants.errorInitialiseService} (${this.errorMessage})`);
        } else {
          this.serviceInitHandle(!!isBookedDepartment);
        }

        this.inProgress = false;

        this.checkExistenceSlots();
      },
      () => {
        this.errorMessage = this.currentService.getErrorMessage();
        this.inProgress = false;
        this.showError(`${this.constants.errorInitialiseService} (${this.errorMessage})`);
      },
    );
  }

  // TODO
  // eslint-disable-next-line @typescript-eslint/typedef
  private renderSingleMonthGrid(output): void {
    output.splice(0, output.length); // in-place clear
    const firstDayOfMonth = moment()
      .year(this.activeYearNumber)
      .month(this.activeMonthNumber)
      .startOf('month')
      .startOf('day');
    const firstDayOfWeekInMonth = firstDayOfMonth.isoWeekday();
    const daysInMonth = firstDayOfMonth.daysInMonth();
    let week = 0;
    output.push([]);
    if (firstDayOfWeekInMonth > 1) {
      for (let i = 1; i < firstDayOfWeekInMonth; i += 1) {
        const date = moment(firstDayOfMonth).add(i - firstDayOfWeekInMonth, 'day');
        output[0].push({ number: date.date(), date: date.toDate() });
      }
    }
    for (let i = 0; i < daysInMonth; i += 1) {
      if (output[week].length && output[week].length % 7 === 0) {
        week += 1;
        output.push([]);
      }
      const date = moment(firstDayOfMonth).add(i, 'day');
      output[week].push({ number: date.date(), date: date.toDate() });
    }
    let days = 0;
    while (output[week].length < 7) {
      const date = moment(firstDayOfMonth).add(1, 'month').add(days, 'day');
      days += 1;
      output[week].push({ number: date.date(), date: date.toDate() });
    }
  }

  /**
   * Генерирует ID совместимый с ID ListItem
   * @example
   * this.generateMonthListId(2020, 0) // 2020-01
   * this.generateMonthListId(2020, 1) // 2020-02
   * this.generateMonthListId(2020, 11) // 2020-12
   * @param year
   * @param month
   * @private
   */
  private generateMonthListId(year: number, month: number): string {
    const monthWithZero = this.getMonthWithZero(month);
    return `${year}-${monthWithZero}`;
  }

  /**
   * Преобразует номер месяца в формат с ведущим нулем
   * @example
   * this.getMonthWithZero(0) // "01"
   * this.getMonthWithZero(1) // "02"
   * this.getMonthWithZero(10) // "11"
   * @param month от 0 до 11
   */
  private getMonthWithZero(month: number): string {
    return String(`00${month + 1}`).slice(-2);
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

  /**
   * Проверяет дату по ограничениям на валидность
   * @param {Date} date дата для валидации
   * @param startType тип обрезания даты, например, до начала дня ('day'), до начала месяца ('month')
   * @returns {boolean} false - дата прошла проверки. true - дата инвалидна
   */
  private checkDateRestrictions(
    date: Date,
    startType: moment_.unitOfTime.StartOf = 'day',
  ): boolean {
    let isInvalid = false;
    const today = moment().startOf(startType);
    const restrictions = this.screenService.component?.attrs?.restrictions || {};
    // Объект с функциями проверки дат на заданные ограничения
    const checks = {
      minDate: (amount, type): boolean => moment(date).isBefore(today.clone().add(amount, type)),
      maxDate: (amount, type): boolean => moment(date).isAfter(today.clone().add(amount, type)),
    };
    // Перебираем все ключи restrictions из attrs до первого "плохого"
    // пример: "minDate": [30, "d"],
    Object.keys(restrictions).some((key) => {
      const [amount, type] = restrictions[key];
      isInvalid = checks[key](amount, type);
      return isInvalid;
    });
    return isInvalid;
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
    const availableMonths = this.currentService.getAvailableMonths();
    if (availableMonths.length) {
      availableMonths.sort((date1: string, date2: string): number => {
        return new Date(date1) > new Date(date2) ? 1 : -1;
      });
      const firstMonthStr = availableMonths[0];
      const lastMonthStr = availableMonths[availableMonths.length - 1];
      for (let month = moment(firstMonthStr); !month.isAfter(lastMonthStr); month.add(1, 'M')) {
        const monthForDropdown = this.getMonthsListItem(month.format('YYYY-M'));
        if (
          !availableMonths.includes(month.format('YYYY-M')) ||
          this.checkDateRestrictions(month.toDate(), 'month')
        ) {
          monthForDropdown.unselectable = true;
        }
        this.monthsYears.push(monthForDropdown);
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
    if (waitingTimeExpired) {
      this.bookedSlot = null;
      this.currentService.setBookedSlot(null);
      this.currentService.bookId = null;
    } else {
      this.bookedSlot = this.currentService.getBookedSlot();
      if (!this.bookedSlot && timeSlot) {
        this.bookedSlot = {
          slotId: timeSlot.slotId,
          slotTime: new Date(timeSlot.visitTimeISO),
          timezone: timeSlot.visitTimeISO.substr(-6),
          areaId: timeSlot.areaId,
        };
        this.currentService.setBookedSlot(this.bookedSlot);
        this.currentService.bookId = this.cachedAnswer.bookId;
      }
    }
  }

  /**
   * Устаналивает строку
   * @param slot
   */
  private setBookedTimeStr(slot: SlotInterface): void {
    const time = moment(slot.slotTime).utcOffset(slot.timezone);
    const formatTemplate = 'D MMMM YYYY года в HH:mm, dddd';
    this.chosenTimeStr = time.format(formatTemplate);
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

    this.currentService = this.timeSlotServices[componentValue.timeSlotType];
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
    this.isChosenTimeStrVisible = isBookedDepartment;
    this.errorMessage = undefined;
    this.activeMonthNumber = this.currentService.getCurrentMonth();
    this.activeYearNumber = this.currentService.getCurrentYear();

    this.fillMonthsYears();
    this.fixedMonth = this.monthsYears.length < 2;
    if (this.currentMonth) {
      this.monthChanged(this.currentMonth);
    }

    this.bookedSlot = this.currentService.getBookedSlot();
    if (this.bookedSlot && isBookedDepartment) {
      this.selectDate(this.bookedSlot.slotTime);
      this.chooseTimeSlot(this.bookedSlot);
    }
  }
}
