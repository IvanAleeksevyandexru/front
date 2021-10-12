import { NgModule } from '@angular/core';
import { ScreenPadModule } from '@epgu/epgu-constructor-ui-kit';
import { BaseModule } from '../../../../shared/base.module';
import { DefaultUniqueScreenWrapperModule } from '../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';
import { DisclaimerModule } from '../../../../shared/components/disclaimer/disclaimer.module';
import { ConfirmPersonalPolicyComponent } from './confirm-personal-policy.component';
@NgModule({
  declarations: [ConfirmPersonalPolicyComponent],
  exports: [ConfirmPersonalPolicyComponent],
  imports: [BaseModule, ScreenPadModule, DefaultUniqueScreenWrapperModule, DisclaimerModule],
  entryComponents: [ConfirmPersonalPolicyComponent],
})
export class ConfirmPersonalPolicyModule {}
