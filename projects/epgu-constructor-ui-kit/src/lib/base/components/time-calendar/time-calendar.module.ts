import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeCalendarComponent } from './time-calendar.component';
import { BaseComponentsModule } from '../base-components/base-components.module';

@NgModule({
  declarations: [TimeCalendarComponent],
  imports: [CommonModule, BaseComponentsModule],
  exports: [TimeCalendarComponent],
})
export class TimeCalendarModule {}
