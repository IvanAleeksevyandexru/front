import { NgModule } from '@angular/core';
import { BaseModule } from '../../../../shared/base.module';
import { PassportModule } from '../../../../shared/components/add-passport/passport.module';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import {
  ConstructorCheckboxModule,
  ConstructorDropdownModule,
  ConstructorLookupModule,
  InputErrorModule,
} from '@epgu/epgu-constructor-ui-kit';
import { ConstructorDadataWidgetModule } from '../../../../shared/components/constructor-dadata-widget/constructor-dadata-widget.module';
import { ConstructorDatePickerModule } from '../../../../shared/components/constructor-date-picker/constructor-date-picker.module';
import { ConstructorMaskedInputModule } from '../../../../shared/components/constructor-masked-input/constructor-masked-input.module';
import { ConstructorPlainInputModule } from '../../../../shared/components/constructor-plain-input/constructor-plain-input.module';
import { FieldListModule } from '../../../../shared/components/field-list/field-list.module';
import { MaritalStatusInputComponent } from './marital-status-input.component';
import { ActDateInputComponent } from './components/act-date-input/act-date-input.component';
import { ActNumberInputComponent } from './components/act-number-input/act-number-input.component';
import { ActRegistratorInputComponent } from './components/act-registrator-input/act-registrator-input.component';

@NgModule({
  declarations: [
    ActDateInputComponent,
    ActNumberInputComponent,
    ActRegistratorInputComponent,
    MaritalStatusInputComponent,
  ],
  exports: [MaritalStatusInputComponent],
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
})
export class MaritalStatusInputModule {}
