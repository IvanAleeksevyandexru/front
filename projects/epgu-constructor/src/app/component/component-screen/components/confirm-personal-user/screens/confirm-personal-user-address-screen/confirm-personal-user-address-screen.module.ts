import { NgModule } from '@angular/core';
import { ConfirmPersonalUserAddressComponent } from './components/confirm-personal-user-address/confirm-personal-user-address.component';
import { SharedModule } from '../../../../../../shared/shared.module';
import { CoreModule } from '../../../../../../core/core.module';
import { DatePipe } from '@angular/common';
import { AddressItemComponent } from './components/address-item/address-item.component';

@NgModule({
  declarations: [
    ConfirmPersonalUserAddressComponent,
    AddressItemComponent
  ],
  exports: [ConfirmPersonalUserAddressComponent],
  imports: [
    CoreModule,
    SharedModule,
  ],
  providers: [DatePipe]
})
export class ConfirmPersonalUserAddressScreenModule { }
