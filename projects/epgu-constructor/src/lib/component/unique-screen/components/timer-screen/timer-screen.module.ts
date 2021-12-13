import { NgModule } from '@angular/core';
import { ScreenPadModule } from '@epgu/epgu-constructor-ui-kit';
import { CommonModule } from '@angular/common';
import { DefaultUniqueScreenWrapperModule } from '../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';
import { TimerScreenComponent } from './timer-screen.component';
import { TimerModule } from '../../../../shared/components/timer/timer.module';

@NgModule({
  declarations: [TimerScreenComponent],
  imports: [CommonModule, ScreenPadModule, DefaultUniqueScreenWrapperModule, TimerModule],
  exports: [TimerScreenComponent],
})
export class TimerScreenModule {}
