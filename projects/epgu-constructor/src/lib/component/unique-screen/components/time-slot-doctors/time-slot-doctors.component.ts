import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ListElement, ValidationShowOn } from '@epgu/epgu-lib';
import { ComponentAttrsDto } from '@epgu/epgu-constructor-types';


@Component({
  selector: 'epgu-constructor-time-slot-doctors',
  templateUrl: './time-slot-doctors.component.html',
  styleUrls: ['./time-slot-doctors.component.css'],
})
export class TimeSlotDoctorsComponent {
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

  readonly validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
}
