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
import { ConstructorMultilineInputModule } from '../constructor-multiline-input/constructor-multiline-input.module';
import { MemoModule } from '../../pipes/memo/memo.module';
import { MultipleChoiceDictionaryModule } from '../multiple-choice-dictionary/multiple-choice-dictionary.module';
import { DocInputModule } from '../doc-input/doc-input.module';
import { ComponentItemModule } from '../component-item/component-item.module';
import { ComponentsListRelationsService } from '../../services/components-list-relations/components-list-relations.service';
import { ShowComponentPipe } from './show-component/show-component.pipe';
import { CheckboxListModule } from '../checkbox-list/checkbox-list.module';
import { MaskedAndPlainInputComponent } from './components/masked-and-plain-input/masked-and-plain-input.component';
import { FormOutputHtmlComponent } from './components/form-output-html/form-output-html.component';
import { TextAreaComponent } from './components/text-area/text-area.component';
import { DropDownDeptsModule } from '../drop-down-depts/drop-down-depts.module';
import { DateInputComponent } from './components/date-input/date-input.component';
import { MultiChoiceDictionaryComponent } from './components/form-multiple-choice-dictionary/multi-choice-dictionary.component';
import { MvdGiacLookupComponent } from './components/mvd-giac-lookup/mvd-giac-lookup.component';
import { PassportLookupComponent } from './components/passport-lookup/passport-lookup.component';
import { CheckboxInputComponent } from './components/checkbox-input/checkbox-input.component';
import { ComponentResolverModule } from '../../../component/component-resolver/component-resolver.module';
import { SuggestHandlerService } from '../../services/suggest-handler/suggest-handler.service';
import { TimerItemComponent } from './components/timer-item/timer-item.component';
import { FieldListItemComponent } from './components/field-list-item/field-list-item.component';
import { DocInputComponent } from '../doc-input/doc-input.component';
import { CheckboxListComponent } from '../checkbox-list/components/checkbox-list/checkbox-list.component';

@NgModule({
  declarations: [
    ComponentsListComponent,
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
  ],
})
export class ComponentsListModule {}
