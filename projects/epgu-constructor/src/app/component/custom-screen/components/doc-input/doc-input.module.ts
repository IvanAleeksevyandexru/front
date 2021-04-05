import { NgModule } from '@angular/core';
import { BaseModule } from '../../../../shared/base.module';
import { PassportModule } from '../../../../shared/components/add-passport/passport.module';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { ConstructorCheckboxModule } from '../../../../shared/components/constructor-checkbox/constructor-checkbox.module';
import { ConstructorDadataWidgetModule } from '../../../../shared/components/constructor-dadata-widget/constructor-dadata-widget.module';
import { ConstructorDatePickerModule } from '../../../../shared/components/constructor-date-picker/constructor-date-picker.module';
import { ConstructorDropdownModule } from '../../../../shared/components/constructor-dropdown/constructor-dropdown.module';
import { ConstructorLookupModule } from '../../../../shared/components/constructor-lookup/constructor-lookup.module';
import { ConstructorMaskedInputModule } from '../../../../shared/components/constructor-masked-input/constructor-masked-input.module';
import { ConstructorPlainInputModule } from '../../../../shared/components/constructor-plain-input/constructor-plain-input.module';
import { FieldListModule } from '../../../../shared/components/field-list/field-list.module';
import { InputErrorModule } from '../../../../shared/components/input-error/input-error.module';
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
