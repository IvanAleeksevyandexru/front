import { NgModule } from '@angular/core';
import { ConfirmPersonalUserPhoneEmailComponent } from './confirm-personal-user-phone-email.component';
import { ScreenPadModule } from '../../../../../../shared/components/screen-pad/screen-pad.module';
import { BaseModule } from '../../../../../../shared/base.module';

@NgModule({
  declarations: [ConfirmPersonalUserPhoneEmailComponent],
  exports: [ConfirmPersonalUserPhoneEmailComponent],
  imports: [BaseModule, ScreenPadModule],
})
export class ConfirmPersonalUserPhoneEmailModule {}
