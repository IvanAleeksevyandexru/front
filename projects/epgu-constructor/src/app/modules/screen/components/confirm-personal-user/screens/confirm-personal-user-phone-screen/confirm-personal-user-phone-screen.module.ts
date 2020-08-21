import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EpguLibModule } from 'epgu-lib';
import { SharedModule } from '../../../../../../shared-module/shared-components.module';
import { SubComponentsModule } from '../../sub-components/sub-components.module';
import { ConfirmPersonalUserPhoneComponent } from './components/confirm-personal-user-phone/confirm-personal-user-phone.component';
import { ConfirmPersonalUserPhoneScreenComponent } from './confirm-personal-user-phone-screen.component';

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
    EpguLibModule.forChild(),
  ]
})
export class ConfirmPersonalUserPhoneScreenModule { }
