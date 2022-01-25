import { NgModule } from '@angular/core';
import {
  ConstructorCheckboxModule,
  ScreenContainerModule,
  TimeCalendarModule,
  ScreenPadModule,
  DatesToolsService,
} from '@epgu/epgu-constructor-ui-kit';
import { FormsModule } from '@angular/forms';
import { TimeSlotsComponent } from './time-slots.component';
import { TimeSlotsConstants } from './time-slots.constants';
import { Smev3TimeSlotsRestService } from './smev3-time-slots-rest.service';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';

import { BaseModule } from '../../../../shared/base.module';

import { TimeSlotsService } from './time-slots.service';
import { Smev2TimeSlotsRestService } from './smev2-time-slots-rest.service';
import { ScreenButtonsModule } from '../../../../shared/components/screen-buttons/screen-buttons.module';

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
    ScreenButtonsModule,
    ConstructorCheckboxModule,
  ],
})
export class TimeSlotsModule {}
