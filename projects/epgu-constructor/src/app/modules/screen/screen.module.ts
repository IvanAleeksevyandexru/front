import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ScreenComponent} from './components/root/screen.component';
// eslint-disable-next-line max-len
import {ConfirmPersonalUserPhoneScreenModule} from './components/confirm-personal-user/screens/confirm-personal-user-phone-screen/confirm-personal-user-phone-screen.module';
// eslint-disable-next-line max-len
import {ConfirmPersonalUserAddressScreenModule} from './components/confirm-personal-user/screens/confirm-personal-user-address-screen/confirm-personal-user-address-screen.module';
// eslint-disable-next-line max-len
import {ConfirmPersonalUserDataScreenModule} from './components/confirm-personal-user/screens/confirm-personal-user-data-screen/confirm-personal-user-data-screen.module';
import {EpguLibModule} from 'epgu-lib';
// eslint-disable-next-line max-len
import {ConfirmPersonalUserEmailScreenModule} from './components/confirm-personal-user/screens/confirm-personal-user-email-screen/confirm-personal-user-email-screen.module';
// eslint-disable-next-line max-len
import {AddChildrenScreenModule} from '../unique/components/add-children/screens/add-children-screen/add-children-screen.module';
// eslint-disable-next-line max-len
import {TemporaryRegistrationAddrScreenModule} from './components/confirm-personal-user/screens/temporary-registration-addr/temporary-registration-addr-screen.module';
import {EpgucSharedModule} from '../../shared-module/shared-components.module';

const COMPONENTS = [
  ScreenComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    CommonModule,
    ConfirmPersonalUserPhoneScreenModule,
    ConfirmPersonalUserEmailScreenModule,
    ConfirmPersonalUserAddressScreenModule,
    ConfirmPersonalUserDataScreenModule,
    AddChildrenScreenModule,
    TemporaryRegistrationAddrScreenModule,

    EpgucSharedModule,
    EpguLibModule.forChild(),
  ]
})
export class ScreenModule { }
