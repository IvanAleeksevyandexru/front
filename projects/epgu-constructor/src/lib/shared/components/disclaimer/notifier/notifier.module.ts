import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotifierDisclaimerComponent } from './notifier.component';
import { NotifierSetting } from './notifier.model';
import { NotifierDisclaimerService } from '../../../services/notifier/notifier.service';
import { DisclaimerModule } from '../disclaimer.module';

@NgModule({
  imports: [CommonModule, DisclaimerModule],
  declarations: [NotifierDisclaimerComponent],
  providers: [
    NotifierDisclaimerService,
    {
      provide: 'notifierSetting',
      useValue: NotifierSetting,
    },
  ],
  exports: [NotifierDisclaimerComponent],
})
export class NotifierDisclaimerModule {}
