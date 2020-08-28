import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EpguLibModule } from 'epgu-lib';

import { SharedModule } from '../../../../shared-module/shared-components.module';

import { CarInfoComponent } from './components/car-info-screen/car-info.component';

import { CarInfoLegalPipe } from './pipes/car-info.pipe';
import { CarInfoStatusPipe } from './pipes/car-status.pipe';
import { CarInfoDatePipe } from './pipes/car-date-format.pipe';
import { CarInfoOwnerPipe } from './pipes/car-owner-type.pipe';
import { CarInfoAccidentsPipe } from './pipes/car-accidents.pipe';

const COMPONENTS = [
  CarInfoComponent,

  CarInfoLegalPipe,
  CarInfoStatusPipe,
  CarInfoDatePipe,
  CarInfoOwnerPipe,
  CarInfoAccidentsPipe,
];

@NgModule({
  declarations: [...COMPONENTS],
  providers: [],
  exports: [...COMPONENTS],
  imports: [
    CommonModule,
    SharedModule,
    EpguLibModule.forChild(),
  ]
})
export class CarInfoModule { }
