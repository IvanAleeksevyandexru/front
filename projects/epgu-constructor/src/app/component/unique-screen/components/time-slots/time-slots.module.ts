import { NgModule } from '@angular/core';
import { TimeSlotsComponent } from './time-slots.component';
import { SharedModule } from '../../../../shared/shared.module';
import { BrakTimeSlotsService } from './brak-time-slots.service';
import { DivorceTimeSlotsService } from './divorce-time-slots.service';
import { GibddTimeSlotsService } from './gibdd-time-slots.service';
import { MvdTimeSlotsService } from './mvd-time-slots.service';
import { TimeSlotsConstants } from './time-slots.constants';
import { Smev3TimeSlotsRestService } from './smev3-time-slots-rest.service';
import { CoreModule } from '../../../../core/core.module';

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
    CoreModule,
    SharedModule
  ]
})
export class TimeSlotsModule { }
