import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { EpguLibModule } from 'epgu-lib';

import { SharedModule } from '../../../../shared/shared.module';
import { ConfirmMarriageComponent } from './components/confirm-marriage.component';
import { TimerComponent } from './components/timer/timer.component';
import { TimerPipe } from './pipes/timer.pipe';

const COMPONENTS = [ConfirmMarriageComponent, TimerComponent, TimerPipe];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  providers: [],
  imports: [CommonModule, SharedModule, ReactiveFormsModule, EpguLibModule.forChild()],
})
export class ConfirmMarriageModule {}
