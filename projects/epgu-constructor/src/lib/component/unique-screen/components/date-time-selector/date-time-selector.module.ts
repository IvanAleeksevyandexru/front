import { NgModule } from '@angular/core';
import { DateTimeSelectorComponent } from './components/date-time-selector/date-time-selector.component';
import { AreaSelectorComponent } from './components/area-selector/area-selector.component';
import { DateTimeSelectorScreenComponent } from './components/date-time-selector-screen/date-time-selector-screen.component';
import { DateTimeSelectorContainerComponent } from './components/date-time-selector-container/date-time-selector-container.component';
import { DaySelectorComponent } from './components/day-selector/day-selector.component';
import { MonthSelectorComponent } from './components/month-selector/month-selector.component';
import { TimeSelectorComponent } from './components/time-selector/time-selector.component';
import { BaseModule } from '../../../../shared/base.module';
import {
  ConstructorCheckboxModule,
  ScreenContainerModule,
  ScreenPadModule,
} from '@epgu/epgu-constructor-ui-kit';
import { StateService } from './services/state/state.service';

import { DayComponent } from './components/day/day.component';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { SlotsService } from './services/slots/slots.service';
import { ErrorService } from './services/error/error.service';
import { Smev2Service } from './services/api/smev2/smev2.service';
import { Smev3Service } from './services/api/smev3/smev3.service';
import { FormsModule } from '@angular/forms';
import { ScreenButtonsModule } from '../../../../shared/components/screen-buttons/screen-buttons.module';

@NgModule({
  declarations: [
    DateTimeSelectorComponent,
    DayComponent,
    AreaSelectorComponent,
    DateTimeSelectorScreenComponent,
    DateTimeSelectorContainerComponent,
    DaySelectorComponent,
    MonthSelectorComponent,
    TimeSelectorComponent,
  ],
  exports: [
    DateTimeSelectorScreenComponent,
    DateTimeSelectorContainerComponent,
    MonthSelectorComponent,
    DaySelectorComponent,
    TimeSelectorComponent,
  ],
  providers: [Smev2Service, Smev3Service, SlotsService, StateService, ErrorService],
  imports: [
    BaseModule,
    BaseComponentsModule,
    ScreenContainerModule,
    ScreenPadModule,
    FormsModule,
    ScreenButtonsModule,
    ConstructorCheckboxModule,
  ],
  entryComponents: [DateTimeSelectorScreenComponent, DateTimeSelectorContainerComponent],
})
export class DateTimeSelectorModule {}
