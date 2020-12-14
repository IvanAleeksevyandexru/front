import { NgModule } from '@angular/core';
import { ConfirmPersonalUserPhoneEmailComponent } from './confirm-personal-user-phone-email.component';
import { CoreModule } from '../../../../../../core/core.module';
import { ActionModule } from '../../../../../../shared/directives/action/action.module';

@NgModule({
  declarations: [ConfirmPersonalUserPhoneEmailComponent],
  exports: [ConfirmPersonalUserPhoneEmailComponent],
  imports: [CoreModule, ActionModule],
})
export class ConfirmPersonalUserPhoneEmailModule {}
