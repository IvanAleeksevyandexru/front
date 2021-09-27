import { Type } from '@angular/core';
import { AddressInputComponent } from '../components/address-input/address-input.component';
import { CheckboxInputComponent } from '../components/checkbox-input/checkbox-input.component';
import { CheckboxListComponent } from '../components/checkbox-list/checkbox-list.component';
import { CityInputComponent } from '../components/city-input/city-input.component';
import { CustomScreenComponentTypes } from '../components-list.types';
import { DateInputComponent } from '../components/date-input/date-input.component';
import { DepartmentLookupComponent } from '../components/department-lookup/department-lookup.component';
import { DictionaryComponent } from '../components/dictionary/dictionary.component';
import { DocInputComponent } from '../components/doc-input/doc-input.component';
import { DropdownComponent } from '../components/dropdown/dropdown.component';
import { EaisdoGroupCostComponent } from '../components/eaisdo-group-cost/eaisdo-group-cost.component';
import { FieldListItemComponent } from '../components/field-list-item/field-list-item.component';
import { FileUploadFormComponent } from '../components/file-upload-form/file-upload-form.component';
import { FormOutputHtmlComponent } from '../components/form-output-html/form-output-html.component';
import { LookupInputComponent } from '../components/lookup-input/lookup-input.component';
import { MaskedAndPlainInputComponent } from '../components/masked-and-plain-input/masked-and-plain-input.component';
import { MonthPickerComponent } from '../components/month-picker/month-picker.component';
import { MultiChoiceDictionaryComponent } from '../components/form-multiple-choice-dictionary/multi-choice-dictionary.component';
import { MvdGiacLookupComponent } from '../components/mvd-giac-lookup/mvd-giac-lookup.component';
import { PassportLookupComponent } from '../components/passport-lookup/passport-lookup.component';
import { RadioInputComponent } from '../components/radio-input/radio-input.component';
import { SearchableDropdownComponent } from '../components/searchable-dropdown/searchable-dropdown.component';
import { TextAreaComponent } from '../components/text-area/text-area.component';
import { TimerItemComponent } from '../components/timer-item/timer-item.component';
import { CertificateEaisdoComponent } from '../components/certificate-eaisdo/certificate-eaisdo.component';
import { CalendarInputComponent } from '../components/calendar-input/calendar-input.component';
import { RestLookupInputComponent } from '../components/rest-lookup-input/rest-lookup-input.component';
import { FormDisclaimerComponent } from '../components/form-disclaimer/form-disclaimer.component';
import { ConfirmPersonalPolicyChangeComponent } from '../components/confirm-personal-policy-change/confirm-personal-policy-change.component';

export type ComponentTypes = CustomScreenComponentTypes;

type CustomScreenComponent =
  | AddressInputComponent
  | CertificateEaisdoComponent
  | CheckboxInputComponent
  | CheckboxListComponent
  | CityInputComponent
  | ConfirmPersonalPolicyChangeComponent
  | DateInputComponent
  | CalendarInputComponent
  | DepartmentLookupComponent
  | FormDisclaimerComponent
  | DocInputComponent
  | EaisdoGroupCostComponent
  | FieldListItemComponent
  | FileUploadFormComponent
  | FormOutputHtmlComponent
  | LookupInputComponent
  | MaskedAndPlainInputComponent
  | MonthPickerComponent
  | MultiChoiceDictionaryComponent
  | MvdGiacLookupComponent
  | PassportLookupComponent
  | RadioInputComponent
  | RestLookupInputComponent
  | SearchableDropdownComponent
  | TextAreaComponent
  | TimerItemComponent;

export type ScreenComponentTypes = CustomScreenComponent;

export const CUSTOM_SCREEN_COMPONENTS: Partial<Record<
  CustomScreenComponentTypes,
  Type<CustomScreenComponent>
>> = {
  AddressInput: AddressInputComponent,
  CardNumberInput: MaskedAndPlainInputComponent,
  CertificateEaisdo: CertificateEaisdoComponent,
  CheckBox: CheckboxInputComponent,
  CheckBoxList: CheckboxListComponent,
  CheckingAccount: MaskedAndPlainInputComponent,
  CityInput: CityInputComponent,
  ConfirmPersonalPolicyChange: ConfirmPersonalPolicyChangeComponent,
  ConfirmPersonalUserRegAddrChange: AddressInputComponent,
  DateInput: DateInputComponent,
  CalendarInput: CalendarInputComponent,
  Dictionary: DictionaryComponent,
  Disclaimer: FormDisclaimerComponent,
  DocInput: DocInputComponent,
  DropDown: DropdownComponent,
  DropDownDepts: DepartmentLookupComponent,
  EaisdoGroupCost: EaisdoGroupCostComponent,
  FieldList: FieldListItemComponent,
  FileUploadComponent: FileUploadFormComponent,
  HtmlString: FormOutputHtmlComponent,
  LabelSection: FormOutputHtmlComponent,
  LegalInnInput: MaskedAndPlainInputComponent,
  Lookup: LookupInputComponent,
  RestLookup: RestLookupInputComponent,
  MonthPicker: MonthPickerComponent,
  MultipleChoiceDictionary: MultiChoiceDictionaryComponent,
  MvdGiac: MvdGiacLookupComponent,
  NewEmailInput: MaskedAndPlainInputComponent,
  NewLegalEmailInput: MaskedAndPlainInputComponent,
  OgrnInput: MaskedAndPlainInputComponent,
  OgrnipInput: MaskedAndPlainInputComponent,
  PassportLookup: PassportLookupComponent,
  PersonInnInput: MaskedAndPlainInputComponent,
  PhoneNumberChangeInput: MaskedAndPlainInputComponent,
  RadioInput: RadioInputComponent,
  SearchableDropDown: SearchableDropdownComponent,
  SnilsInput: MaskedAndPlainInputComponent,
  StringInput: MaskedAndPlainInputComponent,
  TextArea: TextAreaComponent,
  Timer: TimerItemComponent,
};
