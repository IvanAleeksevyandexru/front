import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpguLibModule } from 'epgu-lib';
import { TimeSlotsComponent } from './time-slots.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { BrakTimeSlotsService } from './brak-time-slots.service';
import { DivorceTimeSlotsService } from './divorce-time-slots.service';
import { MvdTimeSlotsService } from './mvd-time-slots.service';

const COMPONENTS = [
  TimeSlotsComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  providers: [
    BrakTimeSlotsService,
    DivorceTimeSlotsService,
    MvdTimeSlotsService],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    EpguLibModule.forChild(),
  ]
})
export class TimeSlotsModule { }
