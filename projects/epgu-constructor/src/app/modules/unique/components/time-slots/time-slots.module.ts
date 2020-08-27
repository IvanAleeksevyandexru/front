import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpguLibModule } from 'epgu-lib';
import { TimeSlotsComponent } from './time-slots.component';
import { ReactiveFormsModule } from '@angular/forms';
import {EpgucSharedModule} from '../../../../shared-module/shared-components.module';
import {BrakTimeSlotsService} from './brak-time-slots.service';

const COMPONENTS = [
  TimeSlotsComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  providers: [BrakTimeSlotsService],
  imports: [
    CommonModule,
    EpgucSharedModule,
    ReactiveFormsModule,
    EpguLibModule.forChild(),
  ]
})
export class TimeSlotsModule { }
