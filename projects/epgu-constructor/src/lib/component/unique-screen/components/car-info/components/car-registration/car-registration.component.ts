import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { VehicleOwnerInfo } from '../../../car-list/models/car-list.interface';

@Component({
  selector: 'epgu-constructor-car-registration',
  templateUrl: './car-registration.component.html',
  styleUrls: ['./car-registration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarRegistrationComponent {
  @Input() vehicleInfo: VehicleOwnerInfo;
}
