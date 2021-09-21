import { NgModule } from '@angular/core';
import { TimeSlotsComponent } from './time-slots.component';
import { TimeSlotsConstants } from './time-slots.constants';
import { Smev3TimeSlotsRestService } from './smev3-time-slots-rest.service';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { ScreenContainerModule, TimeCalendarModule } from '@epgu/epgu-constructor-ui-kit';
import { ScreenPadModule } from '@epgu/epgu-constructor-ui-kit';
import { BaseModule } from '../../../../shared/base.module';
import { DatesToolsService } from '@epgu/epgu-constructor-ui-kit';
import { TimeSlotsService } from './time-slots.service';
import { Smev2TimeSlotsRestService } from './smev2-time-slots-rest.service';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [TimeSlotsComponent],
  exports: [TimeSlotsComponent],
  providers: [
    TimeSlotsConstants,
    Smev3TimeSlotsRestService,
    DatesToolsService,
    TimeSlotsService,
    Smev2TimeSlotsRestService,
  ],
  imports: [
    BaseModule,
    BaseComponentsModule,
    ScreenContainerModule,
    ScreenPadModule,
    TimeCalendarModule,
    FormsModule,
  ],
  entryComponents: [TimeSlotsComponent],
})
export class TimeSlotsModule {}
