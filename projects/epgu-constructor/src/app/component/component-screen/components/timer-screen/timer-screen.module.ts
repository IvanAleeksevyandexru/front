import { NgModule } from '@angular/core';
import { ComponentWrapperModule } from '../../shared/component-wrapper.module';
import { TimerScreenComponent } from './timer-screen.component';
import { ScreenPadModule } from '../../../../shared/components/screen-pad/screen-pad.module';
import { CommonModule } from '@angular/common';
import { TimerModule } from '../../../../shared/components/timer/timer.module';

@NgModule({
  declarations: [TimerScreenComponent],
  imports: [
    CommonModule,
    ScreenPadModule,
    ComponentWrapperModule,
    TimerModule,
  ],
  exports: [TimerScreenComponent],
})
export class TimerScreenModule {}
