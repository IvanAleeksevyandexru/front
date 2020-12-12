import { NgModule } from '@angular/core';
import { TimeSlotsComponent } from './time-slots.component';
import { BrakTimeSlotsService } from './brak-time-slots.service';
import { DivorceTimeSlotsService } from './divorce-time-slots.service';
import { GibddTimeSlotsService } from './gibdd-time-slots.service';
import { MvdTimeSlotsService } from './mvd-time-slots.service';
import { TimeSlotsConstants } from './time-slots.constants';
import { Smev3TimeSlotsRestService } from './smev3-time-slots-rest.service';
import { CoreModule } from '../../../../core/core.module';
import { BaseModule } from '../../../../shared/components/base/base.module';
import { ScreenContainerModule } from '../../../../shared/components/screen-container/screen-container.module';
import { ScreenPadModule } from '../../../../shared/components/screen-pad/screen-pad.module';

const COMPONENTS = [TimeSlotsComponent];

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
  imports: [CoreModule, BaseModule, ScreenContainerModule, ScreenPadModule],
})
export class TimeSlotsModule {}
