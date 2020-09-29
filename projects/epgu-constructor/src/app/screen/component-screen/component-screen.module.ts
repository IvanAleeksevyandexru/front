import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EpguLibModule } from 'epgu-lib';
import { SharedModule } from '../../shared/shared.module';
import { ScreenService } from '../screen.service';
import { ComponentScreenComponent } from './component-screen.component';
import { AddChildrenScreenModule } from './components/add-children/screens/add-children-screen/add-children-screen.module';
import { AddPassportModule } from './components/add-passport/add-passport.module';
import { ChangeListComponent } from './components/change-list/change-list.component';
// eslint-disable-next-line max-len
import { ConfirmPersonalUserAddressScreenModule } from './components/confirm-personal-user/screens/confirm-personal-user-address-screen/confirm-personal-user-address-screen.module';
// eslint-disable-next-line max-len
import { ConfirmPersonalUserDataScreenModule } from './components/confirm-personal-user/screens/confirm-personal-user-data-screen/confirm-personal-user-data-screen.module';
// eslint-disable-next-line max-len
import { ConfirmPersonalUserEmailScreenModule } from './components/confirm-personal-user/screens/confirm-personal-user-email-screen/confirm-personal-user-email-screen.module';
// eslint-disable-next-line max-len
import { ConfirmPersonalUserPhoneScreenModule } from './components/confirm-personal-user/screens/confirm-personal-user-phone-screen/confirm-personal-user-phone-screen.module';
// eslint-disable-next-line max-len
import { TemporaryRegistrationAddrScreenModule } from './components/confirm-personal-user/screens/temporary-registration-addr/temporary-registration-addr-screen.module';
import { CountrySelectionComponent } from './components/country-selection/country-selection.component';
import { DocInputModule } from './components/doc-input/doc-input.module';
import { MvdGiacModule } from './components/mvd-giac/mvd-giac.module';


const COMPONENTS = [
  ComponentScreenComponent,
  ChangeListComponent,
  CountrySelectionComponent,
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
    MvdGiacModule,
    DocInputModule,
    SharedModule,
    EpguLibModule,
  ],
  providers: [
    ScreenService
  ]
})
export class ComponentScreenModule {}
