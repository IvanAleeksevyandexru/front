import { NgModule } from '@angular/core';
import { ValidationService } from '../../services/validation/validation.service';
import { AddressHelperService } from '../../services/address-helper/address-helper.service';
import { ComponentsListToolsService } from '../../services/components-list-tools/components-list-tools.service';
import { ComponentsListComponent } from './components-list.component';
import { DictionaryApiService } from '../../services/dictionary/dictionary-api.service';
import { TimerModule } from '../timer/timer.module';
import { ConstructorPlainInputModule } from '../constructor-plain-input/constructor-plain-input.module';
import { ConstructorMaskedInputModule } from '../constructor-masked-input/constructor-masked-input.module';
import { PassportModule } from '../add-passport/passport.module';
import { ConstructorDadataWidgetModule } from '../constructor-dadata-widget/constructor-dadata-widget.module';
import { ConstructorDropdownModule } from '../constructor-dropdown/constructor-dropdown.module';
import { ConstructorLookupModule } from '../constructor-lookup/constructor-lookup.module';
import { ConstructorCheckboxModule } from '../constructor-checkbox/constructor-checkbox.module';
import { BaseComponentsModule } from '../base-components/base-components.module';
import { InputErrorModule } from '../input-error/input-error.module';
import { FieldListModule } from '../field-list/field-list.module';
import { CurrencyModule } from '../../directives/currency/currency.module';
import { ConstructorDatePickerModule } from '../constructor-date-picker/constructor-date-picker.module';
import { BaseModule } from '../../base.module';
import { DateRangeService } from '../../services/date-range/date-range.service';
import {
  ConstructorMultilineInputModule
} from '../constructor-multiline-input/constructor-multiline-input.module';
import { MemoModule } from '../../pipes/memo/memo.module';
import { MultipleChoiceDictionaryModule } from '../multiple-choice-dictionary/multiple-choice-dictionary.module';
import { DocInputModule } from '../doc-input/doc-input.module';
import { ComponentItemModule } from '../component-item/component-item.module';
import { ComponentsListRelationsService } from '../../services/components-list-relations/components-list-relations.service';

const COMPONENTS = [ComponentsListComponent];

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
    ConstructorMultilineInputModule,
    MemoModule,
    MultipleChoiceDictionaryModule,
    ComponentItemModule,
    DocInputModule,
  ],
  providers: [
    ValidationService,
    AddressHelperService,
    ComponentsListToolsService,
    ComponentsListRelationsService,
    DictionaryApiService,
    DateRangeService,
  ],
})
export class ComponentsListModule {}