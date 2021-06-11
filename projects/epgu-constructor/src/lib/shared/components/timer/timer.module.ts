import { NgModule } from '@angular/core';
import { CoreModule } from '../../../core/core.module';
import { EventBusService } from '@epgu/epgu-constructor-ui-kit';
import { BaseModule } from '../../base.module';
import { ScreenPadModule } from '@epgu/epgu-constructor-ui-kit';
import { TimerPipe } from './pipes/timer.pipe';
import { TimerComponent } from './timer.component';

const COMPONENTS = [TimerComponent, TimerPipe];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [CoreModule, ScreenPadModule, BaseModule],
  providers: [EventBusService],
})
export class TimerModule {}
