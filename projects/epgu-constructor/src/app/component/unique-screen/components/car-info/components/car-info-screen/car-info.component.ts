import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { CarInfo } from '../../models/car-info.interface';

// TODO компонент на удаление (объединить с epgu-constructor-confirm-personal-user-data)
@Component({
  selector: 'epgu-constructor-car-info',
  templateUrl: './car-info.component.html',
  styleUrls: ['./car-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarInfoComponent implements OnInit {
  @Input() carInfo: CarInfo;

  ngOnInit(): void {}
}
