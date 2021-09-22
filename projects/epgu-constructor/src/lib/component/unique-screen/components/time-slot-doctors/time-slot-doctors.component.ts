import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ValidationShowOn } from '@epgu/ui/models/common-enums';
import { ComponentAttrsDto, ScreenButton } from '@epgu/epgu-constructor-types';
import {
  ConstructorCheckboxComponent,
  ConstructorLookupComponent,
  ErrorTemplate,
  IDay,
  SlotInterface,
} from '@epgu/epgu-constructor-ui-kit';
import { ListElement } from '@epgu/ui/models/dropdown';

@Component({
  selector: 'epgu-constructor-time-slot-doctors',
  templateUrl: './time-slot-doctors.component.html',
  styleUrls: ['./time-slot-doctors.component.scss'],
})
export class TimeSlotDoctorsComponent {
  @ViewChild('specLookup') specLookup: ConstructorLookupComponent;
  @ViewChild('docLookup') docLookup: ConstructorLookupComponent;
  @ViewChild('checkboxComponent') checkboxComponent: ConstructorCheckboxComponent;

  @Input() daysNotFoundTemplate: ErrorTemplate;
  @Input() timeNotFoundTemplate: ErrorTemplate;
  @Input() doctorsNotFoundTemplate: ErrorTemplate;

  @Input() screenErrorButton: ScreenButton;
  @Input() label: string;
  @Input() isValid: boolean;
  @Input() selectedTimeStr = '';
  @Input() inLoadingProgress: boolean;
  @Input() inBookingProgress: boolean;
  @Input() isLoading: boolean;
  @Input() labelButton: string;
  @Input() isDoctorsNotAvailable = false;
  @Input() areSlotsNotAvailable = false;
  @Input() isDocLookupDisclaimerShown;

  @Input() monthsRange: string;
  @Input() slotList: SlotInterface[];
  @Input() weeks: IDay[][] = [];
  @Input() currentSlot: SlotInterface;

  @Input() isExistsSlots = true;

  @Input() timeSlots: SlotInterface[] = [];

  @Input() specProvider;
  @Input() doctorProvider;

  @Input() specLookupControl;
  @Input() docLookupControl;
  @Input() checkboxControl;

  @Input() specLookupAttrs: ComponentAttrsDto;
  @Input() docLookupAttrs: ComponentAttrsDto;
  @Input() timeSlotAttrs: ComponentAttrsDto;
  @Input() checkboxLabel: string;

  @Input() isDocLookupShown: boolean;
  @Input() isMapShown: boolean;

  @Output() specLookupWasChanged = new EventEmitter<ListElement>();
  @Output() docLookupWasChanged = new EventEmitter<ListElement>();

  @Output() chooseTimeSlot = new EventEmitter<SlotInterface>();
  @Output() selectDate = new EventEmitter<Date>();
  @Output() bookSlot = new EventEmitter<void>();

  readonly validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
}
