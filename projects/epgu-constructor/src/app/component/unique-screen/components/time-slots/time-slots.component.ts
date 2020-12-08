import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ListItem } from 'epgu-lib';
import * as moment_ from 'moment';
import { takeUntil } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { BrakTimeSlotsService } from './brak-time-slots.service';
import { TimeSlotsServiceInterface } from './time-slots.interface';
import { DivorceTimeSlotsService } from './divorce-time-slots.service';
import { GibddTimeSlotsService } from './gibdd-time-slots.service';
import { MvdTimeSlotsService } from './mvd-time-slots.service';
import { ModalService } from '../../../../modal/modal.service';
import { TimeSlotsConstants } from './time-slots.constants';
import { SlotInterface } from './time-slots.types';
import { DisplayDto } from '../../../../form-player/services/form-player-api/form-player-api.types';
import { ConfirmationModal } from '../../../../modal/confirmation-modal/confirmation-modal.interface';
import { ConfirmationModalComponent } from '../../../../modal/confirmation-modal/confirmation-modal.component';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';
import { ScreenService } from '../../../../screen/screen.service';
import { COMMON_ERROR_MODAL_PARAMS } from '../../../../core/interceptor/errors/errors.interceptor.constants';
import { months, weekDaysAbbr } from '../../../../shared/constants/dates';

const moment = moment_;

@Component({
  selector: 'epgu-constructor-time-slots',
  templateUrl: './time-slots.component.html',
  styleUrls: ['./time-slots.component.scss'],
  providers: [UnsubscribeService],
})
export class TimeSlotsComponent implements OnInit {
  @Input() isLoading: boolean;
  @Input() data: DisplayDto;
  @Output() nextStepEvent = new EventEmitter();

  public date: Date = null;
  public label: string;
  public activeMonthNumber: number;
  public activeYearNumber: number;

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

  constructor(
    private changeDetection: ChangeDetectorRef,
    private brakTimeSlotsService: BrakTimeSlotsService,
    private divorceTimeSlotsService: DivorceTimeSlotsService,
    private gibddTimeSlotsService: GibddTimeSlotsService,
    private mvdTimeSlotsService: MvdTimeSlotsService,
    private modalService: ModalService,
    private currentAnswersService: CurrentAnswersService,
    public constants: TimeSlotsConstants,
    private ngUnsubscribe$: UnsubscribeService,
    private screenService: ScreenService,
  ) {
    this.timeSlotServices.BRAK = brakTimeSlotsService;
    this.timeSlotServices.RAZBRAK = divorceTimeSlotsService;
    this.timeSlotServices.GIBDD = gibddTimeSlotsService;
    this.timeSlotServices.MVD = mvdTimeSlotsService;
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
   * Проверяет есть ли в текущем месяце пустые слоты
   * Если да, to this.isExistsSlots = true
   * Функция вызывается при каждой регенерации календаря
   */
  public checkExistenceSlots(): void {
    let isExistsSlots = false;
    this.weeks.forEach((week) => {
      week.forEach((day) => {
        if (!this.currentService.isDateLocked(day.date)) {
          isExistsSlots = true;
        }
      });
    });
    this.isExistsSlots = isExistsSlots;
  }

  public isToday(date: Date): boolean {
    return date && moment().isSame(moment(date), 'day');
  }

  public isHoliday(date: Date): boolean {
    return date && [6, 7].includes(moment(date).isoWeekday());
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

  public selectDate(date: Date): void {
    if (this.isDateLocked(date) || this.isDateOutOfMonth(date)) {
      return;
    }
    this.date = date;
    this.showTimeSlots(date);
  }

  public chooseTimeSlot(slot: SlotInterface): void {
    this.currentSlot = slot;
    this.currentAnswersService.state = slot;
  }

  public isSlotSelected({ slotTime }: SlotInterface): boolean {
    return this.currentSlot && this.currentSlot.slotTime === slotTime;
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

  public clickSubmit(): void {
    if (this.bookedSlot) {
      this.showModal(this.confirmModalParameters);
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
        this.nextStepEvent.emit(JSON.stringify(response));
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

  initCalendar(): void {
    const initDate = new Date();
    this.activeMonthNumber = initDate.getMonth();
    this.activeYearNumber = initDate.getFullYear();
    this.renderSingleMonthGrid(this.weeks);
  }

  ngOnInit(): void {
    if (this.screenService.component) {
      this.loadTimeSlots();
    }
  }

  private loadTimeSlots(): void {
    this.inProgress = true;
    this.label = this.screenService.component?.label;
    const value = JSON.parse(this.screenService.component?.value);
    this.initCalendar();
    this.currentService = this.timeSlotServices[value.timeSlotType];
    this.currentService.init(value).subscribe(
      () => {
        if (this.currentService.hasError()) {
          this.inProgress = false;
          this.errorMessage = this.currentService.getErrorMessage();
          if (this.errorMessage === 101) {
            this.errorMessage = `${this.errorMessage}: ${this.constants.error101ServiceUnavailable}`;
          }
          this.showError(`${this.constants.errorInitialiseService} (${this.errorMessage})`);
        } else {
          this.errorMessage = undefined;
          this.monthsYears = [];
          this.activeMonthNumber = this.currentService.getCurrentMonth();
          this.activeYearNumber = this.currentService.getCurrentYear();

          const availableMonths = this.currentService.getAvailableMonths();
          for (let i = 0; i < availableMonths.length; i += 1) {
            this.monthsYears.push(this.getMonthsListItem(availableMonths[i]));
          }
          const monthListId = this.generateMonthListId(
            this.activeYearNumber,
            this.activeMonthNumber,
          );
          this.currentMonth = this.monthsYears.find((item) => item.id === monthListId);
          this.fixedMonth = this.monthsYears.length < 2;
          this.renderSingleMonthGrid(this.weeks);

          this.bookedSlot = this.currentService.getBookedSlot();
          if (this.bookedSlot) {
            this.selectDate(this.bookedSlot.slotTime);
            this.chooseTimeSlot(this.bookedSlot);
          }
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

  buttonDisabled(): boolean {
    return !this.currentAnswersService.isValid || this.inProgress || !this.isBookSlotSelected();
  }

  isBookSlotSelected(): string {
    return this.currentSlot?.slotId;
  }

  calendarAvailable(): boolean {
    return !this.errorMessage;
  }

  private checkDateRestrictions(date: Date): boolean {
    let isInvalid = false;
    const today = moment().startOf('day');
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
}
