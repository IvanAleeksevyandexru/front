import { NgModule } from '@angular/core';

import { DaySelectorComponent } from './components/day-selector/day-selector.component';
import { DayComponent } from './components/day/day.component';
import { MonthSelectorComponent } from './components/month-selector/month-selector.component';
import { TimeSelectorComponent } from './components/time-selector/time-selector.component';

import { FormsModule } from '@angular/forms';
import { BaseModule } from '../../base.module';
import { BaseComponentsModule } from '../base-components/base-components.module';

@NgModule({
  declarations: [DayComponent, DaySelectorComponent, MonthSelectorComponent, TimeSelectorComponent],
  exports: [DaySelectorComponent, MonthSelectorComponent, TimeSelectorComponent],
  providers: [],
  imports: [BaseModule, BaseComponentsModule, FormsModule],
  entryComponents: [],
})
export class CalendarModule {}
