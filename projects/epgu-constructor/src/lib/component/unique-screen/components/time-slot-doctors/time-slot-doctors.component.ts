import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ListElement, ValidationShowOn } from '@epgu/epgu-lib';
import { ComponentAttrsDto } from '@epgu/epgu-constructor-types';
import { IDay, SlotInterface } from '@epgu/epgu-constructor-ui-kit';


@Component({
  selector: 'epgu-constructor-time-slot-doctors',
  templateUrl: './time-slot-doctors.component.html',
  styleUrls: ['./time-slot-doctors.component.css'],
})
export class TimeSlotDoctorsComponent {
  @Input() weeks: Array<Array<IDay>> = [];
  @Input() currentSlot: SlotInterface;
  @Input() isExistsSlots = true;
  @Input() timeSlots: SlotInterface[] = [];

  @Input() specProvider;
  @Input() doctorProvider;

  @Input() specLookupControl;
  @Input() docLookupControl;

  @Input() specLookupAttrs: ComponentAttrsDto;
  @Input() docLookupAttrs: ComponentAttrsDto;
  @Input() timeSlotAttrs: ComponentAttrsDto;

  @Input() isDocLookupShown: boolean;
  @Input() isMapShown: boolean;

  @Output() specLookupWasChanged = new EventEmitter<ListElement>();
  @Output() docLookupWasChanged = new EventEmitter<ListElement>();

  @Output() chooseTimeSlot = new EventEmitter<SlotInterface>();
  @Output() selectDate = new EventEmitter<Date>();

  readonly validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
}
