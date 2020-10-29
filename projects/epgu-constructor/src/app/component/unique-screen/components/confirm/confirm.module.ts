import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { ConfirmComponent } from './components/confirm.component';
import { TimerComponent } from './components/timer/timer.component';
import { TimerPipe } from './pipes/timer.pipe';
import { CoreModule } from '../../../../core/core.module';

const COMPONENTS = [ConfirmComponent, TimerComponent, TimerPipe];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  providers: [],
  imports: [CoreModule, SharedModule],
})
export class ConfirmModule {}
