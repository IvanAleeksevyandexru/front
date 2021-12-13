import { NgModule } from '@angular/core';
import { EventBusService, ScreenPadModule } from '@epgu/epgu-constructor-ui-kit';
import { BaseModule } from '../../base.module';

import { TimerPipe } from './pipes/timer.pipe';
import { TimerComponent } from './timer.component';

const COMPONENTS = [TimerComponent, TimerPipe];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [ScreenPadModule, BaseModule],
  providers: [EventBusService],
})
export class TimerModule {}
