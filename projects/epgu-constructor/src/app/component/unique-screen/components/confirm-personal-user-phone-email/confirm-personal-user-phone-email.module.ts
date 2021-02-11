import { NgModule } from '@angular/core';
import { ConfirmPersonalUserPhoneEmailComponent } from './confirm-personal-user-phone-email.component';
import { ScreenPadModule } from '../../../../shared/components/screen-pad/screen-pad.module';
import { BaseModule } from '../../../../shared/base.module';
import { DefaultUniqueScreenWrapperModule } from '../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';

@NgModule({
  declarations: [ConfirmPersonalUserPhoneEmailComponent],
  exports: [ConfirmPersonalUserPhoneEmailComponent],
  imports: [BaseModule, ScreenPadModule, DefaultUniqueScreenWrapperModule],
  entryComponents: [ConfirmPersonalUserPhoneEmailComponent]
})
export class ConfirmPersonalUserPhoneEmailModule {}
