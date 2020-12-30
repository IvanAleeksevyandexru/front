import { NgModule } from '@angular/core';
import { DictionaryApiService } from '../shared/services/dictionary-api/dictionary-api.service';
import { AddPassportModule } from './components/add-passport/add-passport.module';
// eslint-disable-next-line max-len
import { ConfirmPersonalUserAddressScreenModule } from './components/confirm-personal-user/screens/confirm-personal-user-address-screen/confirm-personal-user-address-screen.module';
// eslint-disable-next-line max-len
import { ConfirmPersonalUserDataScreenModule } from './components/confirm-personal-user/screens/confirm-personal-user-data-screen/confirm-personal-user-data-screen.module';
// eslint-disable-next-line max-len
import { ConfirmPersonalUserPhoneEmailModule } from './components/confirm-personal-user/screens/confirm-personal-user-phone-email/confirm-personal-user-phone-email.module';
// eslint-disable-next-line max-len
import { RegistrationAddrScreenModule } from './components/confirm-personal-user/screens/registration-addr/registration-addr-screen.module';
import { CountrySelectionComponent } from './components/country-selection/country-selection.component';
import { SelectChildrenScreenModule } from './components/select-children/select-children-screen.module';
import { ConstructorDropdownModule } from '../../shared/components/constructor-dropdown/constructor-dropdown.module';
import { BaseComponentsModule } from '../../shared/components/base-components/base-components.module';
import { ScreenPadModule } from '../../shared/components/screen-pad/screen-pad.module';
import { BaseModule } from '../../shared/base.module';

const COMPONENTS = [CountrySelectionComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    BaseModule,
    ConfirmPersonalUserPhoneEmailModule,
    ConfirmPersonalUserAddressScreenModule,
    ConfirmPersonalUserDataScreenModule,
    SelectChildrenScreenModule,
    RegistrationAddrScreenModule,
    AddPassportModule,
    ConstructorDropdownModule,
    BaseComponentsModule,
    ScreenPadModule,
  ],
  exports: [
    ...COMPONENTS,
    ConfirmPersonalUserPhoneEmailModule,
    ConfirmPersonalUserAddressScreenModule,
    ConfirmPersonalUserDataScreenModule,
    SelectChildrenScreenModule,
    RegistrationAddrScreenModule,
    AddPassportModule,
  ],
  providers: [DictionaryApiService],
})
export class ComponentScreenComponentsModule {}
