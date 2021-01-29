import { NgModule } from '@angular/core';
import { TimeSlotsComponent } from './time-slots.component';
import { TimeSlotsConstants } from './time-slots.constants';
import { Smev3TimeSlotsRestService } from './smev3-time-slots-rest.service';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { ScreenContainerModule } from '../../../../shared/components/screen-container/screen-container.module';
import { ScreenPadModule } from '../../../../shared/components/screen-pad/screen-pad.module';
import { BaseModule } from '../../../../shared/base.module';
import { DatesToolsService } from '../../../../core/services/dates-tools/dates-tools.service';
import { TimeSlotsService } from './time-slots.service';

@NgModule({
  declarations: [TimeSlotsComponent],
  exports: [TimeSlotsComponent],
  providers: [
    TimeSlotsConstants,
    Smev3TimeSlotsRestService,
    DatesToolsService,
    TimeSlotsService,
  ],
  imports: [BaseModule, BaseComponentsModule, ScreenContainerModule, ScreenPadModule],
  entryComponents: [TimeSlotsComponent]
})
export class TimeSlotsModule {}
