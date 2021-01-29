import { NgModule } from '@angular/core';
import { ConfirmPersonalUserAddressComponent } from './components/confirm-personal-user-address/confirm-personal-user-address.component';
import { DatePipe } from '@angular/common';
import { AddressItemComponent } from './components/address-item/address-item.component';
import { BaseComponentsModule } from '../../../../../../shared/components/base-components/base-components.module';
import { TrimModule } from '../../../../../../shared/directives/trim/trim.module';
import { TextTransformModule } from '../../../../../../shared/directives/text-transform/text-transform.module';
import { ScreenPadModule } from '../../../../../../shared/components/screen-pad/screen-pad.module';
import { BaseModule } from '../../../../../../shared/base.module';
import { ComponentWrapperModule } from '../../../../shared/component-wrapper.module';

@NgModule({
  declarations: [ConfirmPersonalUserAddressComponent, AddressItemComponent],
  exports: [ConfirmPersonalUserAddressComponent],
  imports: [BaseModule, BaseComponentsModule, TrimModule, TextTransformModule, ScreenPadModule, ComponentWrapperModule],
  providers: [DatePipe],
  entryComponents: [ConfirmPersonalUserAddressComponent]
})
export class ConfirmPersonalUserAddressScreenModule {}
