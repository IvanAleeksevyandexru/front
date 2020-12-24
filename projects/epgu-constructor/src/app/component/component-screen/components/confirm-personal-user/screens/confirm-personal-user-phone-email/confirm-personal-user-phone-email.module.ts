import { NgModule } from '@angular/core';
import { ConfirmPersonalUserPhoneEmailComponent } from './confirm-personal-user-phone-email.component';
import { CoreModule } from '../../../../../../core/core.module';
import { ActionModule } from '../../../../../../shared/directives/action/action.module';
import { ScreenPadModule } from '../../../../../../shared/components/screen-pad/screen-pad.module';

@NgModule({
  declarations: [ConfirmPersonalUserPhoneEmailComponent],
  exports: [ConfirmPersonalUserPhoneEmailComponent],
  imports: [CoreModule, ActionModule, ScreenPadModule],
})
export class ConfirmPersonalUserPhoneEmailModule {}
