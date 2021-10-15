import AddressInputModel from '../components/address-input/AddressInputModel';
import CardNumberInputModel from '../components/masked-and-plain-input/CardNumberInputModel';
import CertificateEaisdoModel from '../components/certificate-eaisdo/CertificateEaisdoModel';
import CheckboxInputModel from '../components/checkbox-input/CheckboxInputModel';
import CheckboxListModel from '../components/checkbox-list/CheckboxListModel';
import CityInputModel from '../components/city-input/CityInputModel';
import DropdownModel from '../components/dropdown/DropdownModel';
import RadioInputModel from '../components/radio-input/RadioInputModel';
import DictionaryModel from '../components/dictionary/DictionaryModel';
import RestLookupInputModel from '../components/rest-lookup-input/RestLookupInputModel';
import DateInputModel from '../components/date-input/DateInputModel';
import DepartmentLookupModel from '../components/department-lookup/DepartmentLookupModel';
import LookupInputModel from '../components/lookup-input/LookupInputModel';
import MonthPickerModel from '../components/month-picker/MonthPickerModel';
import MvdGiacLookupModel from '../components/mvd-giac-lookup/MvdGiacLookupModel';
import PassportLookupModel from '../components/passport-lookup/PassportLookupModel';
import EaisdoGroupCostModel from '../components/eaisdo-group-cost/EaisdoGroupCostModel';
import CalendarInputModel from '../components/calendar-input/CalendarInputModel';
import SearchableDropdownModel from '../components/searchable-dropdown/SearchableDropdownModel';
import DisclaimerModel from '../components/form-disclaimer/DisclaimerModel';
import DocInputModel from '../components/doc-input/DocInputModel';
import FieldListModel from '../components/field-list-item/FieldListModel';
import FileUploadModel from '../components/file-upload-form/FileUploadModel';
import HtmlStringModel from '../components/form-output-html/HtmlStringModel';
import LabelSectionModel from '../components/form-output-html/LabelSectionModel';
import LegalInnInputModel from '../components/masked-and-plain-input/LegalInnInputModel';
import MultipleChoiceDictionaryModel from '../components/form-multiple-choice-dictionary/MultipleChoiceDictionaryModel';
import OgrnInputModel from '../components/masked-and-plain-input/OgrnInputModel';
import OgrnIpInputModel from '../components/masked-and-plain-input/OgrnIpInputModel';
import PersonInnInputModel from '../components/masked-and-plain-input/PersonInnInputModel';
import PhoneNumberChangeInputModel from '../components/masked-and-plain-input/PhoneNumberChangeInputModel';
import SnilsInputModel from '../components/masked-and-plain-input/SnilsInputModel';
import StringInputModel from '../components/masked-and-plain-input/StringInputModel';
import TextAreaModel from '../components/text-area/TextAreaModel';
import TimerItemModel from '../components/timer-item/TimerItem';
import SignAppLinkModel from '../components/sign-app-link/SignAppLinkModel';
import MaritalStatusInputModel from '../components/marital-status-input/MaritalStatusInputModel';
import ConfirmPersonalPolicyChangeModel
  from '../components/confirm-personal-policy-change/ConfirmPersonalPolicyChangeModel';

export const CUSTOM_SCREEN_MODELS = {
  AddressInput: AddressInputModel,
  CardNumberInput: CardNumberInputModel,
  CertificateEaisdo: CertificateEaisdoModel,
  CheckBox: CheckboxInputModel,
  CheckBoxList: CheckboxListModel,
  CityInput: CityInputModel,
  ConfirmPersonalPolicyChange: ConfirmPersonalPolicyChangeModel,
  ConfirmPersonalUserRegAddrChange: AddressInputModel,
  DateInput: DateInputModel,
  CalendarInput: CalendarInputModel,
  Dictionary: DictionaryModel,
  Disclaimer: DisclaimerModel,
  DocInput: DocInputModel,
  DropDown: DropdownModel,
  DropDownDepts: DepartmentLookupModel,
  EaisdoGroupCost: EaisdoGroupCostModel,
  FieldList: FieldListModel,
  FileUploadModel: FileUploadModel,
  HtmlString: HtmlStringModel,
  LabelSection: LabelSectionModel,
  LegalInnInput: LegalInnInputModel ,
  Lookup: LookupInputModel,
  RestLookup: RestLookupInputModel,
  MaritalStatusInput: MaritalStatusInputModel,
  MonthPicker: MonthPickerModel,
  MultipleChoiceDictionary: MultipleChoiceDictionaryModel,
  MvdGiac: MvdGiacLookupModel,
  OgrnInput: OgrnInputModel,
  OgrnipInput: OgrnIpInputModel,
  PassportLookup: PassportLookupModel,
  PersonInnInput: PersonInnInputModel,
  PhoneNumberChangeInput: PhoneNumberChangeInputModel,
  RadioInput: RadioInputModel,
  SignAppLink: SignAppLinkModel,
  SearchableDropDown: SearchableDropdownModel,
  SnilsInput: SnilsInputModel,
  StringInput: StringInputModel,
  TextArea: TextAreaModel,
  Timer: TimerItemModel,
};
