import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmPersonalUserButtonComponent } from './confirm-personal-user-button/confirm-personal-user-button.component';
import {
  ConfirmPersonalUserScreenLayoutComponent
} from './confirm-personal-user-screen-layout/confirm-personal-user-screen-layout.component';
import { SharedModule } from '../../../../../shared-module/shared-components.module';
import { AddressItemComponent } from './address-item/address-item.component';

const COMPONENTS = [
  ConfirmPersonalUserButtonComponent,
  ConfirmPersonalUserScreenLayoutComponent,
  AddressItemComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class SubComponentsModule { }
