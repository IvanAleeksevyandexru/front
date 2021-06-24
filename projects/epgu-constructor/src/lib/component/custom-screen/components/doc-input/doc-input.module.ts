import { NgModule } from '@angular/core';
import { BaseModule } from '../../../../shared/base.module';
import { PassportModule } from '../../../../shared/components/add-passport/passport.module';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import {
  ConstructorCheckboxModule,
  ConstructorDropdownModule,
  ConstructorLookupModule,
  InputErrorModule
} from '@epgu/epgu-constructor-ui-kit';
import { ConstructorDadataWidgetModule } from '../../../../shared/components/constructor-dadata-widget/constructor-dadata-widget.module';
import { ConstructorDatePickerModule } from '../../../../shared/components/constructor-date-picker/constructor-date-picker.module';
import { ConstructorMaskedInputModule } from '../../../../shared/components/constructor-masked-input/constructor-masked-input.module';
import { ConstructorPlainInputModule } from '../../../../shared/components/constructor-plain-input/constructor-plain-input.module';
import { FieldListModule } from '../../../../shared/components/field-list/field-list.module';
import { DocInputComponent } from './doc-input.component';

@NgModule({
  declarations: [DocInputComponent],
  exports: [DocInputComponent],
  imports: [
    BaseModule,
    ConstructorPlainInputModule,
    ConstructorMaskedInputModule,
    PassportModule,
    ConstructorDadataWidgetModule,
    ConstructorDropdownModule,
    ConstructorLookupModule,
    ConstructorCheckboxModule,
    BaseComponentsModule,
    InputErrorModule,
    FieldListModule,
    ConstructorDatePickerModule,
  ],
  providers: [
  ],
})
export class DocInputModule {}
