import { NgModule } from '@angular/core';
import { ConfirmPersonalUserAddressComponent } from './components/confirm-personal-user-address/confirm-personal-user-address.component';
import { SharedModule } from '../../../../../../shared/shared.module';
import { CoreModule } from '../../../../../../core/core.module';
import { DatePipe } from '@angular/common';
import { AddressItemComponent } from './components/address-item/address-item.component';
import { ConstructorPlainInputModule } from '../../../../../../shared/components/constructor-plain-input/constructor-plain-input.module';

@NgModule({
  declarations: [
    ConfirmPersonalUserAddressComponent,
    AddressItemComponent
  ],
  exports: [ConfirmPersonalUserAddressComponent],
  imports: [
    CoreModule,
    SharedModule,
    ConstructorPlainInputModule,
  ],
  providers: [DatePipe]
})
export class ConfirmPersonalUserAddressScreenModule { }
