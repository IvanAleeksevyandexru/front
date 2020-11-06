import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { CarInfoValues } from '../../models/car-info.interface';
import { DisplayDto } from '../../../../../../form-player/services/form-player-api/form-player-api.types';

// TODO компонент на удаление (объединить с epgu-constructor-confirm-personal-user-data)
@Component({
  selector: 'epgu-constructor-car-info',
  templateUrl: './car-info.component.html',
  styleUrls: ['./car-info.component.scss'],
})
export class CarInfoComponent implements OnInit {
  @Input() isLoading: boolean;
  @Input() display: DisplayDto;
  @Output() nextStepEvent = new EventEmitter<string>();

  carInfo: CarInfoValues;

  ngOnInit(): void {
    if (this.display.components[0].value) {
      this.carInfo = JSON.parse(this.display.components[0].value);
    }
  }

  nextStep(): void {
    this.nextStepEvent.emit(JSON.stringify(this.carInfo));
  }
}
