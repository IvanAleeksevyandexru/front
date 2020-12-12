import { NgModule } from '@angular/core';
import { ConfirmPersonalUserAddressComponent } from './components/confirm-personal-user-address/confirm-personal-user-address.component';
import { SharedModule } from '../../../../../../shared/shared.module';
import { CoreModule } from '../../../../../../core/core.module';
import { DatePipe } from '@angular/common';
import { AddressItemComponent } from './components/address-item/address-item.component';
import { BaseModule } from '../../../../../../shared/components/base/base.module';
import { TrimModule } from '../../../../../../shared/directives/trim/trim.module';
import { TextTransformModule } from '../../../../../../shared/directives/text-transform/text-transform.module';

@NgModule({
  declarations: [ConfirmPersonalUserAddressComponent, AddressItemComponent],
  exports: [ConfirmPersonalUserAddressComponent],
  imports: [CoreModule, SharedModule, BaseModule, TrimModule, TextTransformModule],
  providers: [DatePipe],
})
export class ConfirmPersonalUserAddressScreenModule {}
