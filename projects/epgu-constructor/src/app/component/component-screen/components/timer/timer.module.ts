import { NgModule } from '@angular/core';
import { TimerComponent } from './timer.component';
import { TimerPipe } from './pipes/timer.pipe';
import { CoreModule } from '../../../../core/core.module';
import { ActionModule } from '../../../../shared/directives/action/action.module';

const COMPONENTS = [TimerComponent, TimerPipe];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  providers: [],
  imports: [CoreModule, ActionModule],
})
export class TimerModule {}
