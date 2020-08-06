import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScreenComponent } from './components/root/screen.component';
import {WelcomeBlockModule} from './components/welcome-block/screens/welcome-block-screen/welcome-block.module';
import {RequirementsListModule} from './components/requirements-list-screen/requirements-list.module';
import {
  ConfirmPersonalUserPhoneScreenModule
} from './components/confirm-personal-user/screens/confirm-personal-user-phone-screen/confirm-personal-user-phone-screen.module';
import {
  ConfirmPersonalUserAddressScreenModule
} from './components/confirm-personal-user/screens/confirm-personal-user-address-screen/confirm-personal-user-address-screen.module';
import {
  ConfirmPersonalUserDataScreenModule
} from './components/confirm-personal-user/screens/confirm-personal-user-data-screen/confirm-personal-user-data-screen.module';
import {EpguLibModule} from 'epgu-lib';
import {SharedComponentsModule} from '../../module-share/shared-components.module';
import {
  ConfirmPersonalUserEmailScreenModule
} from './components/confirm-personal-user/screens/confirm-personal-user-email-screen/confirm-personal-user-email-screen.module';
import {ConfirmCreatedRequestScreenModule} from './components/confirm-created-request-screen/confirm-created-request-screen.module';
import { AddChildrenScreenModule } from '../unique/components/add-children/screens/add-children-screen/add-children-screen.module';
import {NotificationAboutAbsentAccountScreenModule} from './components/notification-about-absent-account/notification-about-absent-account-screen.module';

const COMPONENTS = [
  ScreenComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    CommonModule,
    WelcomeBlockModule,
    RequirementsListModule,
    ConfirmPersonalUserPhoneScreenModule,
    ConfirmPersonalUserEmailScreenModule,
    ConfirmPersonalUserAddressScreenModule,
    ConfirmPersonalUserDataScreenModule,
    ConfirmCreatedRequestScreenModule,
    AddChildrenScreenModule,
    NotificationAboutAbsentAccountScreenModule,

    SharedComponentsModule,
    EpguLibModule.forChild(),
  ]
})
export class ScreenModule { }
