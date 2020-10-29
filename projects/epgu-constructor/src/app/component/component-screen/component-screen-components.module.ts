import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EpguLibModule } from 'epgu-lib';
import { SharedModule } from '../../shared/shared.module';
// eslint-disable-next-line max-len
import { ConfirmPersonalUserPhoneEmailModule } from './components/confirm-personal-user/screens/confirm-personal-user-phone-email/confirm-personal-user-phone-email.module';
// eslint-disable-next-line max-len
import { ConfirmPersonalUserAddressScreenModule } from './components/confirm-personal-user/screens/confirm-personal-user-address-screen/confirm-personal-user-address-screen.module';
// eslint-disable-next-line max-len
import { ConfirmPersonalUserDataScreenModule } from './components/confirm-personal-user/screens/confirm-personal-user-data-screen/confirm-personal-user-data-screen.module';
import { SelectChildrenScreenModule } from './components/select-children/select-children-screen.module';
// eslint-disable-next-line max-len
import { TemporaryRegistrationAddrScreenModule } from './components/confirm-personal-user/screens/temporary-registration-addr/temporary-registration-addr-screen.module';
import { AddPassportModule } from './components/add-passport/add-passport.module';
import { DocInputModule } from './components/doc-input/doc-input.module';
import { CountrySelectionComponent } from './components/country-selection/country-selection.component';
import { ToolsService } from '../shared/services/tools/tools.service';
import { DictionaryApiService } from '../shared/services/dictionary-api/dictionary-api.service';

const COMPONENTS = [
  CountrySelectionComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    SharedModule,
    EpguLibModule,
    ConfirmPersonalUserPhoneEmailModule,
    ConfirmPersonalUserAddressScreenModule,
    ConfirmPersonalUserDataScreenModule,
    SelectChildrenScreenModule,
    TemporaryRegistrationAddrScreenModule,
    AddPassportModule,
    DocInputModule,
  ],
  exports: [
    ...COMPONENTS,
    ConfirmPersonalUserPhoneEmailModule,
    ConfirmPersonalUserAddressScreenModule,
    ConfirmPersonalUserDataScreenModule,
    SelectChildrenScreenModule,
    TemporaryRegistrationAddrScreenModule,
    AddPassportModule,
    DocInputModule
  ],
  providers: [
    ToolsService,
    DictionaryApiService
  ]
})
export class ComponentScreenComponentsModule {}
