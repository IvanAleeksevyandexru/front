import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmPersonalUserPhoneScreenComponent } from './confirm-personal-user-phone-screen.component';
import { SubComponentsModule } from '../../sub-components/sub-components.module';
import { ConfirmPersonalUserPhoneComponent } from './components/confirm-personal-user-phone/confirm-personal-user-phone.component';
import { SharedModule } from '../../../../../../shared-module/shared-components.module';

const COMPONENTS = [
  ConfirmPersonalUserPhoneScreenComponent,
  ConfirmPersonalUserPhoneComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    CommonModule,
    SharedModule,
    SubComponentsModule,
  ]
})
export class ConfirmPersonalUserPhoneScreenModule { }
