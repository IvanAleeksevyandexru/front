import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ConfirmPersonalUserPhoneScreenComponent} from './confirm-personal-user-phone-screen.component';
import {SubComponentsModule} from '../../sub-components/sub-components.module';
import {SharedComponentsModule} from '../../../../../../module-share/shared-components.module';
import {ConfirmPersonalUserPhoneComponent} from './components/confirm-personal-user-phone/confirm-personal-user-phone.component';

const COMPONENTS = [
  ConfirmPersonalUserPhoneScreenComponent
];

@NgModule({
  declarations: [...COMPONENTS, ConfirmPersonalUserPhoneComponent],
  exports: [...COMPONENTS],
  imports: [
    CommonModule,
    SharedComponentsModule,
    SubComponentsModule,
  ]
})
export class ConfirmPersonalUserPhoneScreenModule { }
