import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { VehicleOwnerInfo } from '../../../car-list/models/car-list.interface';

@Component({
  selector: 'epgu-constructor-car-technical-data',
  templateUrl: './car-technical-data.component.html',
  styleUrls: ['./car-technical-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarTechnicalDataComponent {
  @Input() vehicleInfo: VehicleOwnerInfo;
}
