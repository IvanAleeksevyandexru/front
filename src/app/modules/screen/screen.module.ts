import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScreenComponent } from './components/root/screen.component';
import {WelcomeBlockModule} from './components/welcome-block/screens/welcome-block-screen/welcome-block.module';
import {RequirementsListModule} from './components/requirements-list-screen/requirements-list.module';
import {ConfirmPersonalUserPhoneScreenModule} from './components/confirm-personal-user/screens/confirm-personal-user-phone-screen/confirm-personal-user-phone-screen.module';
import {ConfirmPersonalUserAddressScreenModule} from './components/confirm-personal-user/screens/confirm-personal-user-address-screen/confirm-personal-user-address-screen.module';
import {ConfirmPersonalUserDataScreenModule} from './components/confirm-personal-user/screens/confirm-personal-user-data-screen/confirm-personal-user-data-screen.module';
import {EpguLibModule} from 'epgu-lib';
import {SharedComponentsModule} from '../../module-share/shared-components.module';

const COMPONENTS = [
  ScreenComponent
]

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    CommonModule,
    WelcomeBlockModule,
    RequirementsListModule,
    ConfirmPersonalUserPhoneScreenModule,
    ConfirmPersonalUserAddressScreenModule,
    ConfirmPersonalUserDataScreenModule,

    SharedComponentsModule,
    EpguLibModule.forChild(),
  ]
})
export class ScreenModule { }
