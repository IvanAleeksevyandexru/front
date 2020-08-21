import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {EpguLibModule} from 'epgu-lib';
import {EpgucSharedModule} from '../../shared-module/shared-components.module';
import {AddChildrenScreenModule} from '../unique/components/add-children/screens/add-children-screen/add-children-screen.module';
import {ChangeListComponent} from './components/change-list/change-list.component';
// eslint-disable-next-line max-len
import {ConfirmPersonalUserAddressScreenModule} from './components/confirm-personal-user/screens/confirm-personal-user-address-screen/confirm-personal-user-address-screen.module';
// eslint-disable-next-line max-len
import {ConfirmPersonalUserDataScreenModule} from './components/confirm-personal-user/screens/confirm-personal-user-data-screen/confirm-personal-user-data-screen.module';
// eslint-disable-next-line max-len
import {ConfirmPersonalUserEmailScreenModule} from './components/confirm-personal-user/screens/confirm-personal-user-email-screen/confirm-personal-user-email-screen.module';
// eslint-disable-next-line max-len
import {ConfirmPersonalUserPhoneScreenModule} from './components/confirm-personal-user/screens/confirm-personal-user-phone-screen/confirm-personal-user-phone-screen.module';
// eslint-disable-next-line max-len
import {TemporaryRegistrationAddrScreenModule} from './components/confirm-personal-user/screens/temporary-registration-addr/temporary-registration-addr-screen.module';
import {DocInputModule} from './components/doc-input/doc-input.module';
import {ScreenComponent} from './components/root/screen.component';
import {SnilsModule} from './components/snils/snils.module';
import {ScreenComponentService} from './service/screen-component/screen-component.service';
import {AddPassportModule} from './components/add-passport/add-passport.module';


const COMPONENTS = [
  ScreenComponent,
  ChangeListComponent
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
    AddPassportModule,
    SnilsModule,
    DocInputModule,
    EpgucSharedModule,
    EpguLibModule.forChild(),
  ],
  providers: [
    ScreenComponentService,
  ]
})
export class ScreenModule { }
