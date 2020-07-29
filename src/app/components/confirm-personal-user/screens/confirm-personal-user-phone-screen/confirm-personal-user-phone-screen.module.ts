import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ConfirmPersonalUserPhoneScreenComponent} from './confirm-personal-user-phone-screen.component';
import {SubComponentsModule} from '../../sub-components/sub-components.module';
import {SharedComponentsModule} from '../../../shared-components/shared-components.module';
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
    SharedComponentsModule,
    SubComponentsModule,
  ]
})
export class ConfirmPersonalUserPhoneScreenModule { }
