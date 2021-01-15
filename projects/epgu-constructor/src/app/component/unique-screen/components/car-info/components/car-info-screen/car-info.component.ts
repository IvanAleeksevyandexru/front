import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import {
  ComponentActionDto,
  DisplayDto,
} from '../../../../../../form-player/services/form-player-api/form-player-api.types';
import { CarInfoValues } from '../../models/car-info.interface';

// TODO компонент на удаление (объединить с epgu-constructor-confirm-personal-user-data)
@Component({
  selector: 'epgu-constructor-car-info',
  templateUrl: './car-info.component.html',
  styleUrls: ['./car-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarInfoComponent implements OnInit {
  @Input() isLoading: boolean;
  @Input() display: DisplayDto;
  @Input() carInfo: CarInfoValues;
  @Input() showNav: boolean;
  @Input() nextStepAction: ComponentActionDto;

  ngOnInit(): void {}
}
