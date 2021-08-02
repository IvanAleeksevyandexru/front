import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ErrorTemplate, IDay, SlotInterface } from './time-calendar.interface';
import { weekDaysAbbr } from '../../constants/dates';

@Component({
  selector: 'epgu-cf-ui-constructor-time-calendar',
  templateUrl: './time-calendar.component.html',
  styleUrls: ['./time-calendar.component.scss'],
})
export class TimeCalendarComponent {
  @Input() daysNotFoundTemplate: ErrorTemplate;
  @Input() timeNotFoundTemplate: ErrorTemplate;
  @Input() isExistsSlots = false;

  @Input() weeks: IDay[][] = [];
  @Input() currentSlot: SlotInterface;
  @Input() slotList: SlotInterface[];
  @Output() selectDate = new EventEmitter<Date>();
  @Output() chooseTimeSlot = new EventEmitter<SlotInterface>();
  daysOfWeek = weekDaysAbbr;

  public isSlotSelected({ slotId }: SlotInterface): boolean {
    return this.currentSlot && this.currentSlot.slotId === slotId;
  }
}
