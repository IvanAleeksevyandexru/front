import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmPersonalUserAddressScreenComponent } from './confirm-personal-user-address-screen.component';
import {SharedComponentsModule} from '../../../../../../module-share/shared-components.module';
import {SubComponentsModule} from '../../sub-components/sub-components.module';
import {ConfirmPersonalUserAddressComponent} from './components/confirm-personal-user-address/confirm-personal-user-address.component';
import {EpguLibModule} from 'epgu-lib';

const COMPONENTS = [
  ConfirmPersonalUserAddressScreenComponent,
  ConfirmPersonalUserAddressComponent
];


@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    CommonModule,
    SharedComponentsModule,
    SubComponentsModule,
    EpguLibModule.forChild(),
  ]
})
export class ConfirmPersonalUserAddressScreenModule { }
