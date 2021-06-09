import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CarInfo, CarInfoErrors, ServiceResult } from '../../models/car-info.interface';

@Component({
  selector: 'epgu-constructor-car-info',
  templateUrl: './car-info.component.html',
  styleUrls: ['./car-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarInfoComponent {
  @Input() carInfo: CarInfo;
  @Input() carInfoErrors: CarInfoErrors;
  statuses = ServiceResult;
}
