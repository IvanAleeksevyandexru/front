import { NgModule } from '@angular/core';
import { ConfirmPersonalUserAddressComponent } from './components/confirm-personal-user-address/confirm-personal-user-address.component';
import { CoreModule } from '../../../../../../core/core.module';
import { DatePipe } from '@angular/common';
import { AddressItemComponent } from './components/address-item/address-item.component';
import { BaseModule } from '../../../../../../shared/components/base/base.module';
import { TrimModule } from '../../../../../../shared/directives/trim/trim.module';
import { TextTransformModule } from '../../../../../../shared/directives/text-transform/text-transform.module';
import { ScreenPadModule } from '../../../../../../shared/components/screen-pad/screen-pad.module';

@NgModule({
  declarations: [ConfirmPersonalUserAddressComponent, AddressItemComponent],
  exports: [ConfirmPersonalUserAddressComponent],
  imports: [CoreModule, BaseModule, TrimModule, TextTransformModule, ScreenPadModule],
  providers: [DatePipe],
})
export class ConfirmPersonalUserAddressScreenModule {}
