import { NgModule } from '@angular/core';
import { TimerComponent } from './timer.component';
import { TimerPipe } from './pipes/timer.pipe';
import { BaseModule } from '../../../../shared/base.module';

const COMPONENTS = [TimerComponent, TimerPipe];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [BaseModule]
})
export class TimerModule {}
