import { NgModule } from '@angular/core';
// eslint-disable-next-line max-len
import { ConfirmPersonalUserAddressReadonlyComponent } from './components/confirm-personal-user-address-readonly/confirm-personal-user-address-readonly.component';
import { DatePipe } from '@angular/common';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { TrimModule } from '../../../../shared/directives/trim/trim.module';
import { TextTransformModule } from '../../../../shared/directives/text-transform/text-transform.module';
import { ScreenPadModule } from '../../../../shared/components/screen-pad/screen-pad.module';
import { BaseModule } from '../../../../shared/base.module';
import { DefaultUniqueScreenWrapperModule } from '../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';
import { FieldListModule } from '../../../../shared/components/field-list/field-list.module';
import { ConstructorDatePickerModule } from '../../../../shared/components/constructor-date-picker/constructor-date-picker.module';

@NgModule({
  declarations: [ConfirmPersonalUserAddressReadonlyComponent],
  exports: [ConfirmPersonalUserAddressReadonlyComponent],
    imports: [
        BaseModule,
        BaseComponentsModule,
        TrimModule,
        FieldListModule,
        TextTransformModule,
        ScreenPadModule,
        DefaultUniqueScreenWrapperModule,
        ConstructorDatePickerModule
    ],
  providers: [DatePipe],
  entryComponents: [ConfirmPersonalUserAddressReadonlyComponent]
})
export class ConfirmPersonalUserAddressReadonlyScreenModule {}