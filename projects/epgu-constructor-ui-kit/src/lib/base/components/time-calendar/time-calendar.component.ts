import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IDay, SlotInterface } from './time-calendar.interface';
import { weekDaysAbbr } from '../../constants/dates';

@Component({
  selector: 'epgu-cf-ui-constructor-time-calendar',
  templateUrl: './time-calendar.component.html',
  styleUrls: ['./time-calendar.component.scss'],
})
export class TimeCalendarComponent {
  @Input() weeks: Array<Array<IDay>> = [];
  @Input() isExistsSlots = false;
  @Input() currentSlot: SlotInterface;
  @Input() slotList: SlotInterface[];
  @Output() selectDate = new EventEmitter<Date>();
  @Output() chooseTimeSlot = new EventEmitter<SlotInterface>();
  daysOfWeek = weekDaysAbbr;

  public isSlotSelected({ slotId }: SlotInterface): boolean {
    return this.currentSlot && this.currentSlot.slotId === slotId;
  }
}
