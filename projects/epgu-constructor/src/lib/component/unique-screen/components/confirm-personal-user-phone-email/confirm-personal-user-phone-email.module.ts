import { NgModule } from '@angular/core';
import { ScreenPadModule, IconsModule } from '@epgu/epgu-constructor-ui-kit';
import { FormatPhoneModule } from '@epgu/ui/pipes';
import { ConfirmPersonalUserPhoneEmailComponent } from './confirm-personal-user-phone-email.component';
import { BaseModule } from '../../../../shared/base.module';
import { DefaultUniqueScreenWrapperModule } from '../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';
import { DisclaimerModule } from '../../../../shared/components/disclaimer/disclaimer.module';

@NgModule({
  declarations: [ConfirmPersonalUserPhoneEmailComponent],
  exports: [ConfirmPersonalUserPhoneEmailComponent],
  imports: [
    BaseModule,
    ScreenPadModule,
    DefaultUniqueScreenWrapperModule,
    DisclaimerModule,
    FormatPhoneModule,
    IconsModule,
  ],
})
export class ConfirmPersonalUserPhoneEmailModule {}
