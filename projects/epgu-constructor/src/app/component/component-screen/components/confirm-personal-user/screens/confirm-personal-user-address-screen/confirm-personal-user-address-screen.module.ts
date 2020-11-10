import { NgModule } from '@angular/core';
import { ConfirmPersonalUserAddressScreenComponent } from './confirm-personal-user-address-screen.component';
import { SubComponentsModule } from '../../sub-components/sub-components.module';
import { ConfirmPersonalUserAddressComponent } from './components/confirm-personal-user-address/confirm-personal-user-address.component';
import { SharedModule } from '../../../../../../shared/shared.module';
import { CoreModule } from '../../../../../../core/core.module';

const COMPONENTS = [
  ConfirmPersonalUserAddressScreenComponent,
  ConfirmPersonalUserAddressComponent
];


@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    CoreModule,
    SharedModule,
    SubComponentsModule,
  ]
})
export class ConfirmPersonalUserAddressScreenModule { }
