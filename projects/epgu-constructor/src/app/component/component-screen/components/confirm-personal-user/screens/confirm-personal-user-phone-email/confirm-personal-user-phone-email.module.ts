import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../shared/shared.module';
import { ConfirmPersonalUserPhoneEmailComponent } from './confirm-personal-user-phone-email.component';
import { CoreModule } from '../../../../../../core/core.module';

@NgModule({
  declarations: [ConfirmPersonalUserPhoneEmailComponent,],
  exports: [ConfirmPersonalUserPhoneEmailComponent,],
  imports: [
    CoreModule,
    SharedModule,
  ],
})
export class ConfirmPersonalUserPhoneEmailModule { }
