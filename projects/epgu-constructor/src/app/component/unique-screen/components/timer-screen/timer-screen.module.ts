import { NgModule } from '@angular/core';
import { DefaultUniqueScreenWrapperModule } from '../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';
import { TimerScreenComponent } from './timer-screen.component';
import { ScreenPadModule } from '../../../../shared/components/screen-pad/screen-pad.module';
import { CommonModule } from '@angular/common';
import { TimerModule } from '../../../../shared/components/timer/timer.module';

@NgModule({
  declarations: [TimerScreenComponent],
  imports: [
    CommonModule,
    ScreenPadModule,
    DefaultUniqueScreenWrapperModule,
    TimerModule,
  ],
  exports: [TimerScreenComponent],
})
export class TimerScreenModule {}
