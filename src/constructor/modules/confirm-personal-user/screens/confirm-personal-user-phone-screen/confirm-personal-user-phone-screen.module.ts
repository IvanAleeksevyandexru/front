import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ConfirmPersonalUserPhoneScreenComponent} from './confirm-personal-user-phone-screen.component';
import {SharedModule} from '../../../../../shared/shared.module';
import {ConfirmPersonalUserShareModule} from '../../modules/confirm-personal-user-share/confirm-personal-user-share.module';
import {ConfirmPersonalUserPhoneComponent} from './components/confirm-personal-user-phone/confirm-personal-user-phone.component';

const COMPONENTS = [
  ConfirmPersonalUserPhoneScreenComponent,
  ConfirmPersonalUserPhoneComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    CommonModule,
    SharedModule,
    ConfirmPersonalUserShareModule,
  ]
})
export class ConfirmPersonalUserPhoneScreenModule { }
