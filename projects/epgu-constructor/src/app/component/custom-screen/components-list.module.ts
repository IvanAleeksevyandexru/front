import { NgModule } from '@angular/core';
import { ValidationService } from '../../shared/services/validation/validation.service';
import { AddressHelperService } from '../../shared/services/address-helper/address-helper.service';
import { ComponentsListToolsService } from './services/components-list-tools/components-list-tools.service';
import { ComponentsListComponent } from './components-list.component';
import { DictionaryApiService } from '../../shared/services/dictionary/dictionary-api.service';
import { TimerModule } from '../../shared/components/timer/timer.module';
import { ConstructorPlainInputModule } from '../../shared/components/constructor-plain-input/constructor-plain-input.module';
import { ConstructorMaskedInputModule } from '../../shared/components/constructor-masked-input/constructor-masked-input.module';
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
import { DateRangeService } from '../../shared/services/date-range/date-range.service';
import { ConstructorMultilineInputModule } from '../../shared/components/constructor-multiline-input/constructor-multiline-input.module';
import { MemoModule } from '../../shared/pipes/memo/memo.module';
import { MultipleChoiceDictionaryModule } from '../../shared/components/multiple-choice-dictionary/multiple-choice-dictionary.module';
import { DocInputModule } from './components/doc-input/doc-input.module';
import { ComponentItemModule } from './components/component-item/component-item.module';
import { ComponentsListRelationsService } from './services/components-list-relations/components-list-relations.service';
import { ShowComponentPipe } from './show-component/show-component.pipe';
import { CheckboxListModule } from './components/checkbox-list/checkbox-list.module';
import { MaskedAndPlainInputComponent } from './components/masked-and-plain-input/masked-and-plain-input.component';
import { FormOutputHtmlComponent } from './components/form-output-html/form-output-html.component';
import { TextAreaComponent } from './components/text-area/text-area.component';
import { DropDownDeptsModule } from '../../shared/components/drop-down-depts/drop-down-depts.module';
import { DateInputComponent } from './components/date-input/date-input.component';
import { MultiChoiceDictionaryComponent } from './components/form-multiple-choice-dictionary/multi-choice-dictionary.component';
import { MvdGiacLookupComponent } from './components/mvd-giac-lookup/mvd-giac-lookup.component';
import { PassportLookupComponent } from './components/passport-lookup/passport-lookup.component';
import { CheckboxInputComponent } from './components/checkbox-input/checkbox-input.component';
import { ComponentResolverModule } from '../component-resolver/component-resolver.module';
import { SuggestHandlerService } from '../../shared/services/suggest-handler/suggest-handler.service';
import { TimerItemComponent } from './components/timer-item/timer-item.component';
import { FieldListItemComponent } from './components/field-list-item/field-list-item.component';
import { DocInputComponent } from './components/doc-input/doc-input.component';
import { CheckboxListComponent } from './components/checkbox-list/checkbox-list.component';
import { AbstractComponentListItemComponent } from './components/abstract-component-list-item/abstract-component-list-item.component';
import { CityInputComponent } from './components/city-input/city-input.component';

@NgModule({
  declarations: [
    ComponentsListComponent,
    AbstractComponentListItemComponent,
    ShowComponentPipe,
    MaskedAndPlainInputComponent,
    FormOutputHtmlComponent,
    DateInputComponent,
    MvdGiacLookupComponent,
    TextAreaComponent,
    MultiChoiceDictionaryComponent,
    PassportLookupComponent,
    CheckboxInputComponent,
    TimerItemComponent,
    FieldListItemComponent,
    CityInputComponent,
  ],
  exports: [ComponentsListComponent],
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
    CheckboxListModule,
    DropDownDeptsModule,
    ComponentResolverModule,
  ],
  providers: [
    ValidationService,
    AddressHelperService,
    ComponentsListToolsService,
    ComponentsListRelationsService,
    DictionaryApiService,
    DateRangeService,
    SuggestHandlerService,
  ],
  entryComponents: [
    MaskedAndPlainInputComponent,
    FormOutputHtmlComponent,
    MvdGiacLookupComponent,
    DateInputComponent,
    TextAreaComponent,
    TimerItemComponent,
    DocInputComponent,
    FieldListItemComponent,
    MultiChoiceDictionaryComponent,
    CheckboxListComponent,
    CheckboxInputComponent,
    PassportLookupComponent,
    CityInputComponent
  ],
})
export class ComponentsListModule {}
