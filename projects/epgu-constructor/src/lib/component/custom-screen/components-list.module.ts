import { NgModule } from '@angular/core';
import {
  ConstructorCheckboxModule,
  ConstructorDropdownModule,
  ConstructorLookupModule,
  InputErrorModule,
  MemoModule,
  CurrencyModule,
} from '@epgu/epgu-constructor-ui-kit';
import { FormsModule } from '@angular/forms';
import { PluralizeModule } from '@epgu/ui/pipes';
import { ValidationTypeModule } from '../../shared/directives/validation-type/validation-type.module';
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
import { BaseComponentsModule } from '../../shared/components/base-components/base-components.module';
import { FieldListModule } from '../../shared/components/field-list/field-list.module';
import { ConstructorDatePickerModule } from '../../shared/components/constructor-date-picker/constructor-date-picker.module';
import { BaseModule } from '../../shared/base.module';
import { DateRangeService } from '../../shared/services/date-range/date-range.service';
import { ConstructorMultilineInputModule } from '../../shared/components/constructor-multiline-input/constructor-multiline-input.module';
import { MultipleChoiceDictionaryModule } from '../../shared/components/multiple-choice-dictionary/multiple-choice-dictionary.module';
import { ComplexChoiceDictionaryModule } from '../../shared/components/complex-choice-dictionary/complex-choice-dictionary.module';
import { DocInputModule } from './components/doc-input/doc-input.module';
import { ComponentItemModule } from './components/component-item/component-item.module';
import { ComponentsListRelationsService } from './services/components-list-relations/components-list-relations.service';
import { ShowComponentPipe } from './show-component/show-component.pipe';
import { CheckboxListModule } from './components/checkbox-list/checkbox-list.module';
import { FileUploadModule } from '../../shared/components/file-upload/file-upload.module';
import { MaskedAndPlainInputComponent } from './components/masked-and-plain-input/masked-and-plain-input.component';
import { FormOutputHtmlComponent } from './components/form-output-html/form-output-html.component';
import { TextAreaComponent } from './components/text-area/text-area.component';
import { DropDownDeptsModule } from '../../shared/components/drop-down-depts/drop-down-depts.module';
import { DateInputComponent } from './components/date-input/date-input.component';
import { MultiChoiceDictionaryComponent } from './components/form-multiple-choice-dictionary/multi-choice-dictionary.component';
import { ComplexityChoiceDictionaryComponent } from './components/form-complex-choice-dictionary/complex-choice-dictionary.component';
import { MvdGiacLookupComponent } from './components/mvd-giac-lookup/mvd-giac-lookup.component';
import { PassportLookupComponent } from './components/passport-lookup/passport-lookup.component';
import { CheckboxInputComponent } from './components/checkbox-input/checkbox-input.component';
import { SuggestHandlerService } from '../../shared/services/suggest-handler/suggest-handler.service';
import { TimerItemComponent } from './components/timer-item/timer-item.component';
import { FieldListItemComponent } from './components/field-list-item/field-list-item.component';
import { DocInputComponent } from './components/doc-input/doc-input.component';
import { CheckboxListComponent } from './components/checkbox-list/checkbox-list.component';
import { AbstractComponentListItemComponent } from './components/abstract-component-list-item/abstract-component-list-item.component';
import { CityInputComponent } from './components/city-input/city-input.component';
import { AddressInputComponent } from './components/address-input/address-input.component';
import { FileUploadFormComponent } from './components/file-upload-form/file-upload-form.component';
import { ComponentListResolverModule } from './component-list-resolver/component-list-resolver.module';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { SearchableDropdownComponent } from './components/searchable-dropdown/searchable-dropdown.component';
import { DictionaryComponent } from './components/dictionary/dictionary.component';
import { LookupInputComponent } from './components/lookup-input/lookup-input.component';
import { DateRestrictionsService } from '../../shared/services/date-restrictions/date-restrictions.service';
import { MonthPickerComponent } from './components/month-picker/month-picker.component';
import { ConstructorMonthPickerModule } from '../../shared/components/constructor-month-picker/constructor-month-picker.module';
import { DepartmentLookupComponent } from './components/department-lookup/department-lookup.component';
import { RadioInputComponent } from './components/radio-input/radio-input.component';
import { EaisdoGroupCostComponent } from './components/eaisdo-group-cost/eaisdo-group-cost.component';
import { CertificateEaisdoComponent } from './components/certificate-eaisdo/certificate-eaisdo.component';
import { CalendarInputComponent } from './components/calendar-input/calendar-input.component';
import { RestService } from '../../shared/services/rest/rest.service';
import { RestToolsService } from '../../shared/services/rest-tools/rest-tools.service';
import { RestLookupInputComponent } from './components/rest-lookup-input/rest-lookup-input.component';
import { InterpolationService } from '../../shared/services/interpolation/interpolation.service';
import { FormDisclaimerComponent } from './components/form-disclaimer/form-disclaimer.component';
import { DisclaimerModule } from '../../shared/components/disclaimer/disclaimer.module';
import { SignAppLinkComponent } from './components/sign-app-link/sign-app-link.component';
import { ConfirmPersonalPolicyChangeModule } from './components/confirm-personal-policy-change/confirm-personal-policy-change.module';
import { ConfirmPersonalPolicyChangeComponent } from './components/confirm-personal-policy-change/confirm-personal-policy-change.component';
import { MaritalStatusInputModule } from './components/marital-status-input/marital-status-input.module';
import { KinderGartenDraftHandlerComponent } from './components/kinder-garten-draft-handler/kinder-garten-draft-handler.component';
import { RelationResolverService } from './services/components-list-relations/relation-resolver.service';
import { CheckboxCubeItemComponent } from './components/checkbox-cube-item/checkbox-cube-item.component';
import { CheckboxCubeModule } from '../../shared/components/checkbox-cube/checkbox-cube.module';

@NgModule({
  declarations: [
    AbstractComponentListItemComponent,
    AddressInputComponent,
    CertificateEaisdoComponent,
    CheckboxCubeItemComponent,
    CheckboxInputComponent,
    CityInputComponent,
    ComponentsListComponent,
    DateInputComponent,
    CalendarInputComponent,
    DepartmentLookupComponent,
    DictionaryComponent,
    DropdownComponent,
    EaisdoGroupCostComponent,
    FieldListItemComponent,
    FileUploadFormComponent,
    FormDisclaimerComponent,
    FormOutputHtmlComponent,
    LookupInputComponent,
    MaskedAndPlainInputComponent,
    MonthPickerComponent,
    MultiChoiceDictionaryComponent,
    ComplexityChoiceDictionaryComponent,
    MvdGiacLookupComponent,
    PassportLookupComponent,
    RadioInputComponent,
    RestLookupInputComponent,
    SearchableDropdownComponent,
    SignAppLinkComponent,
    ShowComponentPipe,
    TextAreaComponent,
    TimerItemComponent,
    KinderGartenDraftHandlerComponent,
  ],
  exports: [ComponentsListComponent],
  imports: [
    BaseComponentsModule,
    BaseModule,
    CheckboxCubeModule,
    CheckboxListModule,
    ComponentItemModule,
    ComponentListResolverModule,
    ConfirmPersonalPolicyChangeModule,
    ConstructorCheckboxModule,
    ConstructorDadataWidgetModule,
    ConstructorDatePickerModule,
    ConstructorDropdownModule,
    ConstructorLookupModule,
    ConstructorMaskedInputModule,
    ConstructorMonthPickerModule,
    ConstructorMultilineInputModule,
    ConstructorPlainInputModule,
    CurrencyModule,
    DisclaimerModule,
    DocInputModule,
    DropDownDeptsModule,
    FieldListModule,
    FileUploadModule,
    InputErrorModule,
    MemoModule,
    MaritalStatusInputModule,
    MultipleChoiceDictionaryModule,
    PassportModule,
    TimerModule,
    ValidationTypeModule,
    FormsModule,
    PluralizeModule,
    ComplexChoiceDictionaryModule,
  ],
  providers: [
    AddressHelperService,
    ComponentsListRelationsService,
    ComponentsListToolsService,
    DateRangeService,
    DateRestrictionsService,
    DictionaryApiService,
    SuggestHandlerService,
    ValidationService,
    RestService,
    RestToolsService,
    InterpolationService,
    RelationResolverService,
  ],
  entryComponents: [
    AddressInputComponent,
    CheckboxCubeItemComponent,
    CheckboxInputComponent,
    CheckboxListComponent,
    CityInputComponent,
    ConfirmPersonalPolicyChangeComponent,
    DateInputComponent,
    CalendarInputComponent,
    DepartmentLookupComponent,
    DictionaryComponent,
    DocInputComponent,
    DropdownComponent,
    CertificateEaisdoComponent,
    EaisdoGroupCostComponent,
    FieldListItemComponent,
    FileUploadFormComponent,
    FormDisclaimerComponent,
    FormOutputHtmlComponent,
    LookupInputComponent,
    MaskedAndPlainInputComponent,
    MonthPickerComponent,
    MultiChoiceDictionaryComponent,
    ComplexityChoiceDictionaryComponent,
    MvdGiacLookupComponent,
    PassportLookupComponent,
    RadioInputComponent,
    RestLookupInputComponent,
    SearchableDropdownComponent,
    SignAppLinkComponent,
    TextAreaComponent,
    TimerItemComponent,
    KinderGartenDraftHandlerComponent,
  ],
})
export class ComponentsListModule {}
