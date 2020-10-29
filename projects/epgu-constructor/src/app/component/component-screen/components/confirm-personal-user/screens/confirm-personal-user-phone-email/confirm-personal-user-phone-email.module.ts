import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../shared/shared.module';
import { SubComponentsModule } from '../../sub-components/sub-components.module';
import { ConfirmPersonalUserPhoneEmailComponent } from './confirm-personal-user-phone-email.component';
import { CoreModule } from '../../../../../../core/core.module';

const COMPONENTS = [
  ConfirmPersonalUserPhoneEmailComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    CoreModule,
    SharedModule,
    SubComponentsModule,
  ],
})
export class ConfirmPersonalUserPhoneEmailModule { }
