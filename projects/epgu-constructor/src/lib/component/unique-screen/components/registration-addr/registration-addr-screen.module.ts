import { NgModule } from '@angular/core';
import { ScreenPadModule, DatesToolsService } from '@epgu/epgu-constructor-ui-kit';
import { ConstructorPlainInputModule } from '../../../../shared/components/constructor-plain-input/constructor-plain-input.module';
import { RegistrationAddrComponent } from './components/registration-addr/registration-addr.component';
// eslint-disable-next-line max-len
import { ConstructorDadataWidgetModule } from '../../../../shared/components/constructor-dadata-widget/constructor-dadata-widget.module';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { ConstructorDatePickerModule } from '../../../../shared/components/constructor-date-picker/constructor-date-picker.module';
import { BaseModule } from '../../../../shared/base.module';

import { DefaultUniqueScreenWrapperModule } from '../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';
import { ClickableLabelModule } from '../../../../shared/directives/clickable-label/clickable-label.module';
import { RegistrationAddrReadonlyComponent } from './components/registration-addr-readonly/registration-addr-readonly.component';
import { DisclaimerModule } from '../../../../shared/components/disclaimer/disclaimer.module';
import { ValidationService } from '../../../../shared/services/validation/validation.service';

@NgModule({
  declarations: [RegistrationAddrComponent, RegistrationAddrReadonlyComponent],
  exports: [RegistrationAddrComponent],
  imports: [
    BaseModule,
    ConstructorPlainInputModule,
    ConstructorDadataWidgetModule,
    BaseComponentsModule,
    ScreenPadModule,
    ConstructorDatePickerModule,
    DefaultUniqueScreenWrapperModule,
    ClickableLabelModule,
    DisclaimerModule,
  ],
  providers: [DatesToolsService, ValidationService],
})
export class RegistrationAddrScreenModule {}
