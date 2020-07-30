import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmPersonalUserAddressScreenComponent } from './confirm-personal-user-address-screen.component';
import {SharedComponentsModule} from '../../../shared-components/shared-components.module';
import {SubComponentsModule} from '../../sub-components/sub-components.module';
import {ConfirmPersonalUserAddressComponent} from './components/confirm-personal-user-address/confirm-personal-user-address.component';


const COMPONENTS = [
  ConfirmPersonalUserAddressScreenComponent
];


@NgModule({
  declarations: [...COMPONENTS, ConfirmPersonalUserAddressComponent],
  exports: [...COMPONENTS],
  imports: [
    CommonModule,
    SharedComponentsModule,
    SubComponentsModule,
  ]
})
export class ConfirmPersonalUserAddressScreenModule { }
