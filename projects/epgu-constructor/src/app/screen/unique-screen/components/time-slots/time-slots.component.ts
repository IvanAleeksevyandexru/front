import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ListItem } from 'epgu-lib';
import * as moment_ from 'moment';
import { ComponentStateService } from '../../../component-state.service';
import { BrakTimeSlotsService } from './brak-time-slots.service';
import { TimeSlotsService } from './time-slots.service';
import { DivorceTimeSlotsService } from './divorce-time-slots.service';
import { GibddTimeSlotsService } from './gibdd-time-slots.service';
import { MvdTimeSlotsService } from './mvd-time-slots.service';
import { ModalService } from '../../../../services/modal/modal.service';
import { TimeSlotsConstants } from './time-slots.constants';
import { SlotInterface } from './time-slots.types';
import { Display } from '../../../screen.types';
import { ConfirmationModal } from '../../../../shared/components/modal/confirmation-modal/confirmation-modal.interface';
import { ConfirmationModalComponent } from '../../../../shared/components/modal/confirmation-modal/confirmation-modal.component';

const moment = moment_;

@Component({
  selector: 'epgu-constructor-time-slots',
  templateUrl: './time-slots.component.html',
  styleUrls: ['./time-slots.component.scss'],
})
export class TimeSlotsComponent implements OnInit {
  @Input() isLoading: boolean;

  public date: Date = null;
  public label: string;
  public activeMonthNumber: number;
  public activeYearNumber: number;

  confirmModalParameters: ConfirmationModal = {
    text: 'Вы уверены, что хотите поменять забронированное время?',
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

  public daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  public months = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ];

  public weeks = [];
  public monthsYears: ListItem[] = [];
  public timeSlots: SlotInterface[] = [];
  public dialogButtons = [];
  public currentSlot: any;
  public currentMonth: ListItem;
  public blockMobileKeyboard = false;
  public fixedMonth = false;
  public inProgress = false;
  public changeTSConfirm = false;
  initialized = false;
  bookedSlot: SlotInterface;
  errorMessage;

  private timeSlotServices: { [key: string]: TimeSlotsService } = {};
  private currentService: TimeSlotsService;

  constructor(
    private changeDetection: ChangeDetectorRef,
    private brakTimeSlotsService: BrakTimeSlotsService,
    private divorceTimeSlotsService: DivorceTimeSlotsService,
    private gibddTimeSlotsService: GibddTimeSlotsService,
    private mvdTimeSlotsService: MvdTimeSlotsService,
    private modalService: ModalService,
    private componentStateService: ComponentStateService,
    public constants: TimeSlotsConstants,
  ) {
    this.timeSlotServices.BRAK = brakTimeSlotsService;
    this.timeSlotServices.RAZBRAK = divorceTimeSlotsService;
    this.timeSlotServices.GIBDD = gibddTimeSlotsService;
    this.timeSlotServices.MVD = mvdTimeSlotsService;
  }

  @Input() data: Display;
  @Output() nextStepEvent = new EventEmitter<any>();

  private renderSingleMonthGrid(output) {
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

  public isToday(date: Date) {
    return date && moment().isSame(moment(date), 'day');
  }

  public isHoliday(date: Date) {
    return date && [6, 7].includes(moment(date).isoWeekday());
  }

  public isSelected(date: Date) {
    return date && moment(date).isSame(this.date, 'day');
  }

  public isDateOutOfMonth(date: Date) {
    return date && moment(date).month() !== this.activeMonthNumber;
  }

  public isDateLocked(date: Date) {
    return this.isDateOutOfMonth(date) || this.currentService.isDateLocked(date);
  }

  public selectDate(date: Date) {
    if (this.isDateLocked(date) || this.isDateOutOfMonth(date)) {
      return;
    }
    this.date = date;
    this.showTimeSlots(date);
  }

  public chooseTimeSlot(slot) {
    this.currentSlot = slot;
    this.componentStateService.state = slot;
  }

  public isSlotSelected(slot) {
    return this.currentSlot && this.currentSlot.slotTime === slot.slotTime;
  }

  public showTimeSlots(date: Date) {
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

  public monthChanged(ev) {
    const { id } = ev;
    const [activeYear, activeMonth] = id.split('-');
    this.activeMonthNumber = parseInt(activeMonth, 10) - 1;
    this.activeYearNumber = parseInt(activeYear, 10);
    this.renderSingleMonthGrid(this.weeks);
  }

  public clickSubmit() {
    if (this.bookedSlot) {
      this.showModal(this.confirmModalParameters);
    } else {
      this.bookTimeSlot();
    }
  }

  public bookTimeSlot() {
    this.inProgress = true;
    this.currentService.book(this.currentSlot).subscribe((response) => {
      this.inProgress = false;
      if (this.currentService.hasError()) {
        this.showError(
          `${this.constants.errorFailBookTimeSlot}  (${this.currentService.getErrorMessage()})`,
        );
        return;
      }
      this.nextStepEvent.emit(JSON.stringify(response));
    });
  }

  showError(errorMessage: string) {
    const params = this.constants.errorModal;
    params.text = errorMessage;
    this.showModal(params);
  }

  showModal(params) {
    this.modalService.openModal(ConfirmationModalComponent, {
      ...params,
      showCrossButton: !!params.title,
    });
  }

  initCalendar() {
    const initDate = new Date();
    this.activeMonthNumber = initDate.getMonth();
    this.activeYearNumber = initDate.getFullYear();
    this.renderSingleMonthGrid(this.weeks);
  }

  ngOnInit(): void {
    if (this.data.components[0]) {
      this.inProgress = true;
      this.label = this.data.components[0].label;
      const value = JSON.parse(this.data.components[0].value);
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
            this.currentMonth = this.monthsYears.find(
              (item) => item.id === `${this.activeYearNumber}-${this.activeMonthNumber + 1}`,
            );
            this.fixedMonth = this.monthsYears.length < 2;
            this.renderSingleMonthGrid(this.weeks);

            this.bookedSlot = this.currentService.getBookedSlot();
            if (this.bookedSlot) {
              this.selectDate(this.bookedSlot.slotTime);
              this.chooseTimeSlot(this.bookedSlot);
            }
          }

          this.inProgress = false;
          this.initialized = true;
        },
        () => {
          this.errorMessage = this.currentService.getErrorMessage();
          this.inProgress = false;
          this.showError(`${this.constants.errorInitialiseService} (${this.errorMessage})`);
        },
      );
    }
  }

  private getMonthsListItem(monthYear: string) {
    const [activeYear, activeMonth] = monthYear.split('-');
    const monthNumber = parseInt(activeMonth, 10) - 1;
    const yearNumber = parseInt(activeYear, 10);
    return new ListItem({
      id: `${monthYear}`,
      text: `${this.months[monthNumber]} ${yearNumber}`,
    });
  }

  buttonDisabled(): boolean {
    return !this.componentStateService.isValid || this.inProgress || this.isBookSlotSelected();
  }

  isBookSlotSelected(): boolean {
    return this.bookedSlot?.slotId === this.currentSlot?.slotId;
  }

  calendarAvailable(): boolean {
    return this.initialized && !this.errorMessage;
  }
}
