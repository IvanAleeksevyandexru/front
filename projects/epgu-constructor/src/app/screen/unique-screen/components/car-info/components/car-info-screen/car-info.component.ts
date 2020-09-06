import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { DisplayDto } from '../../../../../../services/api/form-player-api/form-player-api.types';
import { CarInfoValues } from '../../models/car-info.interface';

@Component({
  selector: 'epgu-constructor-car-info',
  templateUrl: './car-info.component.html',
  styleUrls: ['./car-info.component.scss'],
})
export class CarInfoComponent implements OnInit {
  @Input() isLoading: boolean;
  @Input() data: DisplayDto;
  @Output() nextStepEvent = new EventEmitter<string>();

  carInfo: CarInfoValues;

  ngOnInit(): void {
    if (this.data.components[0].value) {
      this.carInfo = JSON.parse(this.data.components[0].value);
    }
  }

  nextStep(): void {
    this.nextStepEvent.emit(JSON.stringify(this.carInfo));
  }
}
