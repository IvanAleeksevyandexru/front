import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ListItem } from 'epgu-lib';
import * as moment_ from 'moment';
import { EgpuResponseDisplayInterface } from '../../../../../interfaces/epgu.service.interface';
import { ScreenComponentService } from '../../../screen/service/screen-component/screen-component.service';
import { BrakTimeSlotsService } from './brak-time-slots.service';
import { ConstructorService } from '../../../../services/constructor/constructor.service';
import { TimeSlotsService } from './time-slots.service';
import { DivorceTimeSlotsService } from './divorce-time-slots.service';

const moment = moment_;

@Component({
  selector: 'app-time-slots',
  templateUrl: './time-slots.component.html',
  styleUrls: ['./time-slots.component.scss'],
})
export class TimeSlotsComponent implements OnInit {
  public date: Date = null;
  public label: string;
  public activeMonthNumber: number;
  public activeYearNumber: number;

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

  private timeSlotType = 'timeSlotType';
  private ref = 'ref';

  public weeks = [];
  public monthsYears: ListItem[] = [];
  public timeSlots = [];
  public currentSlot: any;
  public currentMonth: ListItem;
  public blockMobileKeyboard = false;
  public fixedMonth = false;
  public inProgress = false;
  initialized = false;
  bookedSlot;

  private timeSlotServices: { [key: string]: TimeSlotsService } = {};
  private currentService: TimeSlotsService;

  constructor(
    private changeDetection: ChangeDetectorRef,
    private brakTimeSlotsService: BrakTimeSlotsService,
    private divorceTimeSlotsService: DivorceTimeSlotsService,
    public screenComponentService: ScreenComponentService,
    public constructorService: ConstructorService,
  ) {
    this.timeSlotServices.BRAK = brakTimeSlotsService;
    this.timeSlotServices.RAZBRAK = divorceTimeSlotsService;
  }

  @Input() data: EgpuResponseDisplayInterface;
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
    this.screenComponentService.dataToSend = slot;
  }

  public isSlotSelected(slot) {
    return this.currentSlot && this.currentSlot.slotTime === slot.slotTime;
  }

  public showTimeSlots(date: Date) {
    this.currentSlot = null;
    this.timeSlots = this.currentService.getAvailableSlots(date);
  }

  public monthChanged(ev) {
    const { id } = ev;
    this.activeMonthNumber = +id;
    this.renderSingleMonthGrid(this.weeks);
  }

  public bookTimeSlot() {
    this.inProgress = true;
    this.currentService.book(this.currentSlot).subscribe((response) => {
      this.inProgress = false;
      this.nextStepEvent.emit(JSON.stringify(response));
    });
  }

  ngOnInit(): void {
    if (this.data.components[0]) {
      this.inProgress = true;
      this.label = this.data.components[0].label;
      this.currentService = this.timeSlotServices[this.data.components[0].attrs[this.timeSlotType]];
      this.currentService.init(this.data.components[0].attrs[this.ref]).subscribe(() => {
        this.activeMonthNumber = this.currentService.getCurrentMonth();
        this.activeYearNumber = this.currentService.getCurrentYear();

        const availableMonths = this.currentService.getAvailableMonths();
        for (let i = 0; i < availableMonths.length; i += 1) {
          const [activeYear, activeMonth] = availableMonths[i].split('-');
          const activeMonthNumber = parseInt(activeMonth, 10) - 1;
          const activeYearNumber = parseInt(activeYear, 10);
          this.monthsYears.push(
            new ListItem({
              id: `${activeMonthNumber}`,
              text: `${this.months[activeMonthNumber]} ${activeYearNumber}`,
            }),
          );
        }
        [this.currentMonth] = this.monthsYears;
        this.fixedMonth = this.monthsYears.length < 2;

        this.renderSingleMonthGrid(this.weeks);

        this.bookedSlot = this.currentService.getBookedSlot();
        if (this.bookedSlot) {
          this.selectDate(this.bookedSlot.slotTime);
          this.chooseTimeSlot(this.bookedSlot);
        }

        this.inProgress = false;
        this.initialized = true;
      });
    }
  }

  buttonDisabled(): boolean {
    return (
      !this.screenComponentService.isValid ||
      this.inProgress ||
      (this.bookedSlot && this.currentSlot && this.bookedSlot.slotId === this.currentSlot.slotId)
    );
  }
}
