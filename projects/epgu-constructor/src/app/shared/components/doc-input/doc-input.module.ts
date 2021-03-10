import { NgModule } from '@angular/core';
import { BaseModule } from '../../base.module';
import { PassportModule } from '../add-passport/passport.module';
import { BaseComponentsModule } from '../base-components/base-components.module';
import { ConstructorCheckboxModule } from '../constructor-checkbox/constructor-checkbox.module';
import { ConstructorDadataWidgetModule } from '../constructor-dadata-widget/constructor-dadata-widget.module';
import { ConstructorDatePickerModule } from '../constructor-date-picker/constructor-date-picker.module';
import { ConstructorDropdownModule } from '../constructor-dropdown/constructor-dropdown.module';
import { ConstructorLookupModule } from '../constructor-lookup/constructor-lookup.module';
import { ConstructorMaskedInputModule } from '../constructor-masked-input/constructor-masked-input.module';
import { ConstructorPlainInputModule } from '../constructor-plain-input/constructor-plain-input.module';
import { FieldListModule } from '../field-list/field-list.module';
import { InputErrorModule } from '../input-error/input-error.module';
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
