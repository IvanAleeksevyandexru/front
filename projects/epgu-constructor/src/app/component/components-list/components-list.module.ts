import { NgModule } from '@angular/core';
import { ValidationService } from '../../shared/services/validation/validation.service';
import { AddressHelperService } from './services/address-helper/address-helper.service';
import { ComponentListToolsService } from './services/component-list-tools/component-list-tools.service';
import { ComponentsListComponent } from './components-list.component';
import { DictionaryApiService } from '../shared/services/dictionary-api/dictionary-api.service';
import { ComponentItemComponent } from './component-item/component-item.component';
import { DocInputComponent } from './doc-input/doc-input.component';
import { TimerModule } from '../component-screen/components/timer/timer.module';
import { ConstructorPlainInputModule } from '../../shared/components/constructor-plain-input/constructor-plain-input.module';
import { ConstructorMaskedInputModule } from '../../shared/components/epgu-lib/constructor-masked-input/constructor-masked-input.module';
import { PassportModule } from '../../shared/components/add-passport/passport.module';
import { ConstructorDadataWidgetModule } from '../../shared/components/constructor-dadata-widget/constructor-dadata-widget.module';
import { ConstructorDropdownModule } from '../../shared/components/constructor-dropdown/constructor-dropdown.module';
import { ConstructorLookupModule } from '../../shared/components/constructor-lookup/constructor-lookup.module';
import { ConstructorCheckboxModule } from '../../shared/components/constructor-checkbox/constructor-checkbox.module';
import { BaseComponentsModule } from '../../shared/components/base-components/base-components.module';
import { InputErrorModule } from '../../shared/components/input-error/input-error.module';
import { FieldListModule } from '../../shared/components/field-list/field-list.module';
import { CurrencyModule } from '../../shared/directives/currency/currency.module';
import { ConstructorDatePickerModule } from '../../shared/components/constructor-date-picker/constructor-date-picker.module';
import { BaseModule } from '../../shared/base.module';
import { DateRangeService } from './services/date-range/date-range.service';

const COMPONENTS = [ComponentsListComponent, ComponentItemComponent, DocInputComponent];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    BaseModule,
    TimerModule,
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
    CurrencyModule,
    ConstructorDatePickerModule,
  ],
  providers: [
    ValidationService,
    AddressHelperService,
    ComponentListToolsService,
    DictionaryApiService,
    DateRangeService,
  ],
})
export class ComponentsListModule {}
