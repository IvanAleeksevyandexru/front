import { Component, Input } from '@angular/core';
import { ValidationShowOn } from '@epgu/epgu-lib';
import { ComponentAttrsDto } from '@epgu/epgu-constructor-types';
import { Observable } from 'rxjs';

@Component({
  selector: 'epgu-constructor-time-slot-doctors',
  templateUrl: './time-slot-doctors.component.html',
  styleUrls: ['./time-slot-doctors.component.css'],
})
export class TimeSlotDoctorsComponent {
  @Input() specLookupList$: Observable<any>;

  @Input() specLookupAttrs: ComponentAttrsDto;
  @Input() docLookupAttrs: ComponentAttrsDto;
  @Input() timeSlotAttrs: ComponentAttrsDto;

  readonly validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
}
