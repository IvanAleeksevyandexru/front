import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import * as moment from 'moment';

import { DisplayInterface } from '../../../../../../../interfaces/epgu.service.interface';
import { ConstructorService } from '../../../../../../services/constructor/constructor.service';

import { CarInfoValues } from '../../models/car-info.interface';

@Component({
  selector: 'epgu-constructor-car-info',
  templateUrl: './car-info.component.html',
  styleUrls: ['./car-info.component.scss'],
})
export class CarInfoComponent implements OnInit {
  @Input() data: DisplayInterface;
  @Output() nextStepEvent = new EventEmitter<void>();

  carInfo: CarInfoValues;

  constructor(public constructorService: ConstructorService) {}

  ngOnInit(): void {
    if (this.data.components[0].value) {
      this.carInfo = JSON.parse(this.data.components[0].value);
    }
  }

  nextStep(): void {
    this.nextStepEvent.emit();
  }
}
