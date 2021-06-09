import { Type } from '@angular/core';

import { MaskedAndPlainInputComponent } from '../components/masked-and-plain-input/masked-and-plain-input.component';
import { FormOutputHtmlComponent } from '../components/form-output-html/form-output-html.component';
import { CustomScreenComponentTypes } from '../components-list.types';
import { MvdGiacLookupComponent } from '../components/mvd-giac-lookup/mvd-giac-lookup.component';
import { DateInputComponent } from '../components/date-input/date-input.component';
import { TextAreaComponent } from '../components/text-area/text-area.component';
import { DocInputComponent } from '../components/doc-input/doc-input.component';
import { MultiChoiceDictionaryComponent } from '../components/form-multiple-choice-dictionary/multi-choice-dictionary.component';
import { CheckboxListComponent } from '../components/checkbox-list/checkbox-list.component';
import { CheckboxInputComponent } from '../components/checkbox-input/checkbox-input.component';
import { PassportLookupComponent } from '../components/passport-lookup/passport-lookup.component';
import { TimerItemComponent } from '../components/timer-item/timer-item.component';
import { FieldListItemComponent } from '../components/field-list-item/field-list-item.component';
import { CityInputComponent } from '../components/city-input/city-input.component';
import { AddressInputComponent } from '../components/address-input/address-input.component';
import { FileUploadFormComponent } from '../components/file-upload-form/file-upload-form.component';
import { DropdownComponent } from '../components/dropdown/dropdown.component';
import { SearchableDropdownComponent } from '../components/searchable-dropdown/searchable-dropdown.component';
import { DictionaryComponent } from '../components/dictionary/dictionary.component';
import { LookupInputComponent } from '../components/lookup-input/lookup-input.component';
import { MonthPickerComponent } from '../components/month-picker/month-picker.component';

export type ComponentTypes = CustomScreenComponentTypes;

type CustomScreenComponent =
  | MaskedAndPlainInputComponent
  | MvdGiacLookupComponent
  | DateInputComponent
  | MonthPickerComponent
  | TextAreaComponent
  | TimerItemComponent
  | DocInputComponent
  | FieldListItemComponent
  | MultiChoiceDictionaryComponent
  | CheckboxListComponent
  | CheckboxInputComponent
  | PassportLookupComponent
  | FormOutputHtmlComponent
  | CityInputComponent
  | AddressInputComponent
  | FileUploadFormComponent
  | LookupInputComponent
  | SearchableDropdownComponent;

export type ScreenComponentTypes = CustomScreenComponent;

export const CUSTOM_SCREEN_COMPONENTS: Partial<Record<CustomScreenComponentTypes, Type<CustomScreenComponent>>> = {
  NewEmailInput: MaskedAndPlainInputComponent,
  NewLegalEmailInput: MaskedAndPlainInputComponent,
  PhoneNumberChangeInput: MaskedAndPlainInputComponent,
  StringInput: MaskedAndPlainInputComponent,
  OgrnInput: MaskedAndPlainInputComponent,
  OgrnipInput: MaskedAndPlainInputComponent,
  LegalInnInput: MaskedAndPlainInputComponent,
  SnilsInput: MaskedAndPlainInputComponent,
  PersonInnInput: MaskedAndPlainInputComponent,
  CheckingAccount: MaskedAndPlainInputComponent,
  HtmlString: FormOutputHtmlComponent,
  LabelSection: FormOutputHtmlComponent,
  MvdGiac: MvdGiacLookupComponent,
  DateInput: DateInputComponent,
  MonthPicker: MonthPickerComponent,
  TextArea: TextAreaComponent,
  Timer: TimerItemComponent,
  DocInput: DocInputComponent,
  FieldList: FieldListItemComponent,
  MultipleChoiceDictionary: MultiChoiceDictionaryComponent,
  CheckBoxList: CheckboxListComponent,
  CheckBox: CheckboxInputComponent,
  PassportLookup: PassportLookupComponent,
  CityInput: CityInputComponent,
  AddressInput: AddressInputComponent,
  FileUploadComponent: FileUploadFormComponent,
  DropDown: DropdownComponent,
  SearchableDropDown: SearchableDropdownComponent,
  ConfirmPersonalUserRegAddrChange: AddressInputComponent,
  Dictionary: DictionaryComponent,
  Lookup: LookupInputComponent,
};
