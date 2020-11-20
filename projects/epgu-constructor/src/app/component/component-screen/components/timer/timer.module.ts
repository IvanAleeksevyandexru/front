import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { TimerComponent } from './timer.component';
import { TimerPipe } from './pipes/timer.pipe';
import { CoreModule } from '../../../../core/core.module';

const COMPONENTS = [TimerComponent, TimerPipe];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  providers: [],
  imports: [CoreModule, SharedModule],
})
export class TimerModule {}
