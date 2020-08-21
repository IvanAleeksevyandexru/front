import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HelperService, ListItem } from 'epgu-lib';
import * as moment_ from 'moment';
import { EgpuResponseDisplayInterface } from '../../../../../interfaces/epgu.service.interface';

const moment = moment_;

@Component({
  selector: 'app-time-slots',
  templateUrl: './time-slots.component.html',
  styleUrls: ['./time-slots.component.scss'],
})
export class TimeSlotsComponent implements OnInit {
  public date: Date = null;
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

  public weeks = [];
  public monthsYears: ListItem[] = [];
  public timeSlots: Date[] = [];
  public currentSlot: Date;
  public currentMonth: ListItem;
  public blockMobileKeyboard = false;
  public fixedMonth = false;

  constructor(private changeDetection: ChangeDetectorRef) {}

  @Input() data: EgpuResponseDisplayInterface;
  @Output() nextStepEvent = new EventEmitter<any>();

  private renderSingleMonthGrid(output, monthShift) {
    output.splice(0, output.length); // in-place clear
    const firstDayOfMonth = moment()
      .year(this.activeYearNumber)
      .month(this.activeMonthNumber)
      .add(monthShift, 'month')
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
      const date = moment(firstDayOfMonth)
        .add(1, 'month')
        .add((days += 1), 'day');
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
    return this.isDateOutOfMonth(date);
  }

  public suppressMobileKeyboard() {
    if (HelperService.isTouchDevice()) {
      this.blockMobileKeyboard = true;
      this.changeDetection.detectChanges();
    }
  }

  public cancelSupressingMobileKeyboard() {
    this.blockMobileKeyboard = false;
    this.changeDetection.detectChanges();
  }

  public selectDate(date: Date) {
    this.suppressMobileKeyboard();
    if (this.isDateLocked(date)) {
      return;
    }
    this.date = date;
    this.showTimeSlots(date);
  }

  public chooseTimeSlot(slot: Date) {
    this.currentSlot = slot;
  }

  public isSlotSelected(slot: Date) {
    return this.currentSlot === slot;
  }

  public showTimeSlots(date: Date) {
    this.currentSlot = null;
    this.timeSlots = [];
    date.setHours(14, 0);
    for (let i = 0; i < 16; i += 1) {
      if (Math.round(Math.random())) {
        this.timeSlots.push(new Date(date.getTime() + i * 15 * 60000));
      }
    }
  }

  public monthChanged(ev) {
    const { id } = ev;
    this.activeMonthNumber = +id;
    this.renderSingleMonthGrid(this.weeks, 0);
  }

  ngOnInit(): void {
    const date = new Date();
    this.activeMonthNumber = date.getMonth();
    this.activeYearNumber = date.getFullYear();
    for (let i = 0; i < 5; i += 1) {
      this.monthsYears.push(
        new ListItem({
          id: `${this.activeMonthNumber + i}`,
          text: `${this.months[this.activeMonthNumber + i]} ${this.activeYearNumber}`,
        }),
      );
    }

    this.showTimeSlots(date);
    [this.currentMonth] = this.monthsYears;

    this.renderSingleMonthGrid(this.weeks, 0);
  }
}
