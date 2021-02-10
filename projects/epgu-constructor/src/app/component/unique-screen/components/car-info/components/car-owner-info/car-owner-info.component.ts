import { Component, Input } from '@angular/core';
import { OwnerCarInfo } from '../../models/car-info.interface';

@Component({
  selector: 'epgu-constructor-car-owner-info',
  templateUrl: './car-owner-info.component.html',
  styleUrls: ['./car-owner-info.component.scss']
})
export class CarOwnerInfoComponent {
  @Input() carOwnerInfo: OwnerCarInfo;
}
