import { NgModule } from '@angular/core';
import { ConfirmPersonalUserButtonComponent } from './confirm-personal-user-button/confirm-personal-user-button.component';
import { SharedModule } from '../../../../../shared/shared.module';
import { AddressItemComponent } from './address-item/address-item.component';
import { CoreModule } from '../../../../../core/core.module';

const COMPONENTS = [
  ConfirmPersonalUserButtonComponent,
  AddressItemComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    CoreModule,
    SharedModule
  ]
})
export class SubComponentsModule { }
