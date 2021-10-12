import { NgModule } from '@angular/core';
import { ConfirmPersonalUserAddressComponent } from './components/confirm-personal-user-address/confirm-personal-user-address.component';
import { DatePipe } from '@angular/common';
import { AddressItemComponent } from './components/address-item/address-item.component';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { ScreenPadModule, TextTransformModule, TrimModule } from '@epgu/epgu-constructor-ui-kit';
import { BaseModule } from '../../../../shared/base.module';
import { DefaultUniqueScreenWrapperModule } from '../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';
import { ConstructorDatePickerModule } from '../../../../shared/components/constructor-date-picker/constructor-date-picker.module';

@NgModule({
  declarations: [ConfirmPersonalUserAddressComponent, AddressItemComponent],
  exports: [ConfirmPersonalUserAddressComponent],
  imports: [
    BaseModule,
    BaseComponentsModule,
    TrimModule,
    TextTransformModule,
    ScreenPadModule,
    DefaultUniqueScreenWrapperModule,
    ConstructorDatePickerModule,
  ],
  providers: [DatePipe],
  entryComponents: [ConfirmPersonalUserAddressComponent],
})
export class ConfirmPersonalUserAddressScreenModule {}
