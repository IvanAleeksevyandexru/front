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
  @Input() isValid: boolean;
  @Input() isChosenTimeStrVisible: boolean;
  @Input() chosenTimeStr: string;
  @Input() inProgress: boolean;
  @Input() isLoading: boolean;
  @Input() labelButton: string;

  @Input() monthsRange: string;
  @Input() slotList: SlotInterface[];
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
  @Output() bookSlot = new EventEmitter<void>();

  readonly validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
}
