import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpguLibModule } from 'epgu-lib';
import { TimeSlotsComponent } from './time-slots.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { BrakTimeSlotsService } from './brak-time-slots.service';
import { DivorceTimeSlotsService } from './divorce-time-slots.service';
import { GibddTimeSlotsService } from './gibdd-time-slots.service';
import { MvdTimeSlotsService } from './mvd-time-slots.service';
import { TimeSlotsConstants } from './time-slots.constants';
import { Smev3TimeSlotsRestService } from './smev3-time-slots-rest.service';

const COMPONENTS = [
  TimeSlotsComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  providers: [
    TimeSlotsConstants,
    BrakTimeSlotsService,
    DivorceTimeSlotsService,
    GibddTimeSlotsService,
    MvdTimeSlotsService,
    Smev3TimeSlotsRestService,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    EpguLibModule,
  ]
})
export class TimeSlotsModule { }
