import { NgModule } from '@angular/core';
import { ConfirmPersonalUserPhoneEmailComponent } from './confirm-personal-user-phone-email.component';
import { ScreenPadModule } from '../../../../../../shared/components/screen-pad/screen-pad.module';
import { BaseModule } from '../../../../../../shared/base.module';
import { ComponentWrapperModule } from '../../../../shared/component-wrapper.module';

@NgModule({
  declarations: [ConfirmPersonalUserPhoneEmailComponent],
  exports: [ConfirmPersonalUserPhoneEmailComponent],
  imports: [BaseModule, ScreenPadModule, ComponentWrapperModule],
  entryComponents: [ConfirmPersonalUserPhoneEmailComponent]
})
export class ConfirmPersonalUserPhoneEmailModule {}
