import { NgModule } from '@angular/core';
import { ConstructorPlainInputModule } from '../../../../../../shared/components/constructor-plain-input/constructor-plain-input.module';
import { RegistrationAddrComponent } from './components/registration-addr/registration-addr.component';
// eslint-disable-next-line max-len
import { ConstructorDadataWidgetModule } from '../../../../../../shared/components/constructor-dadata-widget/constructor-dadata-widget.module';
import { BaseComponentsModule } from '../../../../../../shared/components/base-components/base-components.module';
import { ScreenPadModule } from '../../../../../../shared/components/screen-pad/screen-pad.module';
import { ConstructorDatePickerModule } from '../../../../../../shared/components/constructor-date-picker/constructor-date-picker.module';
import { BaseModule } from '../../../../../../shared/base.module';

@NgModule({
  declarations: [RegistrationAddrComponent],
  exports: [RegistrationAddrComponent],
    imports: [
        BaseModule,
        ConstructorPlainInputModule,
        ConstructorDadataWidgetModule,
        BaseComponentsModule,
        ScreenPadModule,
        ConstructorDatePickerModule,
    ],
})
export class RegistrationAddrScreenModule {}
