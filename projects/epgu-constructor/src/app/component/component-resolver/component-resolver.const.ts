// eslint-disable-next-line max-len
import { ConfirmPersonalUserAddressComponent } from '../unique-screen/components/confirm-personal-user-address-screen/components/confirm-personal-user-address/confirm-personal-user-address.component';
// eslint-disable-next-line max-len
import { ConfirmPersonalUserDataComponent } from '../unique-screen/components/confirm-personal-user-data-screen/component/confirm-personal-user-data/confirm-personal-user-data.component';
// eslint-disable-next-line max-len
import { ConfirmPersonalUserPhoneEmailComponent } from '../unique-screen/components/confirm-personal-user-phone-email/confirm-personal-user-phone-email.component';
// eslint-disable-next-line max-len
import { RegistrationAddrComponent } from '../unique-screen/components/registration-addr/components/registration-addr/registration-addr.component';
// eslint-disable-next-line max-len
import { AddPassportContainerComponent } from '../unique-screen/components/add-passport/container/add-passport-component-container.component';
// eslint-disable-next-line max-len
import { SelectChildrenScreenContainerComponent } from '../unique-screen/components/select-children/container/select-children-screen-container.component';
import { Type } from '@angular/core';
import { SelectMapObjectComponent } from '../unique-screen/components/select-map-object/select-map-object.component';
import { FileUploadScreenComponent } from '../unique-screen/components/file-upload-screen/file-upload-screen.component';
// eslint-disable-next-line max-len
import { UploadAndEditPhotoContainerComponent } from '../unique-screen/components/upload-and-edit-photo/container/upload-and-edit-photo-container.component';
// eslint-disable-next-line max-len
import { EmployeeHistoryContainerComponent } from '../unique-screen/components/employee-history/container/employee-history-container.component';
import { RepeatableFieldsComponent } from '../unique-screen/components/repeatable-fields/repeatable-fields.component';
import { TimeSlotsComponent } from '../unique-screen/components/time-slots/time-slots.component';
// eslint-disable-next-line max-len
import { SignatureApplicationContainerComponent } from '../unique-screen/components/signature-application/components/container/signature-application-container.component';
import { PaymentComponent } from '../unique-screen/components/payment/components/payment/payment.component';
import { BillInfoComponent } from '../unique-screen/components/payment/components/billinfo/billinfo.component';
// eslint-disable-next-line max-len
import { PaymentTypeSelectorContainerComponent } from '../unique-screen/components/payment-type-selector/components/payment-type-selector-container/payment-type-selector-container.component';
// eslint-disable-next-line max-len
import { UnusedPaymentsContainerComponent } from '../unique-screen/components/unused-payments/container/unused-payments-container.component';
import { UniqueScreenComponentTypes } from '../unique-screen/unique-screen-components.types';
// eslint-disable-next-line max-len
import { InformationCenterMvdContainerComponent } from '../unique-screen/components/information-center-mvd/container/information-center-mvd-container.component';
import { CarInfoContainerComponent } from '../unique-screen/components/car-info/containers/car-info-screen/car-info-container.component';
// eslint-disable-next-line max-len
import { InformationCenterPfrContainerComponent } from '../unique-screen/components/information-center-pfr/container/information-center-pfr-container.component';
import { FieldListScreenComponent } from '../unique-screen/components/field-list-screen/field-list-screen.component';
import { TimerScreenComponent } from '../unique-screen/components/timer-screen/timer-screen.component';
import { CarListContainerComponent } from '../unique-screen/components/car-list/components/car-list-container/car-list-container.component';
// eslint-disable-next-line max-len
import { CarOwnerInfoContainerComponent } from '../unique-screen/components/car-info/containers/car-owner-info-screen/car-owner-info-container.component';
import { AppealFinesContainerComponent } from '../unique-screen/components/appeal-fines/container/appeal-fines-container.component';
// eslint-disable-next-line max-len
import { CheckboxCubeContainerComponent } from '../unique-screen/components/checkbox-cube/checkbox-cube-container/checkbox-cube-container.component';
import { MatPeriodContainerComponent } from '../unique-screen/components/mat-period/mat-period-container/mat-period-container.component';
// eslint-disable-next-line max-len
import { DateTimePeriodContainerComponent } from '../unique-screen/components/date-time-period/components/date-time-period-container/date-time-period-container.component';
// eslint-disable-next-line max-len
import { MaskedAndPlainInputComponent } from '../../shared/components/components-list/components/masked-and-plain-input/masked-and-plain-input.component';
import { FormOutputHtmlComponent } from '../../shared/components/components-list/components/form-output-html/form-output-html.component';
import { CustomScreenComponentTypes } from '../../shared/components/components-list/components-list.types';
import { MvdGiacLookupComponent } from '../../shared/components/components-list/components/mvd-giac-lookup/mvd-giac-lookup.component';
import { DateInputComponent } from '../../shared/components/components-list/components/date-input/date-input.component';
import { TextAreaComponent } from '../../shared/components/components-list/components/text-area/text-area.component';
import { DocInputComponent } from '../../shared/components/components-list/components/doc-input/doc-input.component';
// eslint-disable-next-line max-len
import { MultiChoiceDictionaryComponent } from '../../shared/components/components-list/components/form-multiple-choice-dictionary/multi-choice-dictionary.component';
import { CheckboxListComponent } from '../../shared/components/components-list/components/checkbox-list/checkbox-list.component';
import { CheckboxInputComponent } from '../../shared/components/components-list/components/checkbox-input/checkbox-input.component';
import { PassportLookupComponent } from '../../shared/components/components-list/components/passport-lookup/passport-lookup.component';
import { TimerItemComponent } from '../../shared/components/components-list/components/timer-item/timer-item.component';
import { FieldListItemComponent } from '../../shared/components/components-list/components/field-list-item/field-list-item.component';
import { CityInputComponent } from '../../shared/components/components-list/components/city-input/city-input.component';
import { FileUploadFormComponent } from '../../shared/components/components-list/components/file-upload-form/file-upload-form.component';

export type ComponentTypes = UniqueScreenComponentTypes | CustomScreenComponentTypes;

type UniqueScreenComponent =
  | InformationCenterMvdContainerComponent
  | UnusedPaymentsContainerComponent
  | SelectMapObjectComponent
  | FileUploadScreenComponent
  | UploadAndEditPhotoContainerComponent
  | EmployeeHistoryContainerComponent
  | RepeatableFieldsComponent
  | TimeSlotsComponent
  | CarInfoContainerComponent
  | CarOwnerInfoContainerComponent
  | CarListContainerComponent
  | SignatureApplicationContainerComponent
  | PaymentComponent
  | BillInfoComponent
  | PaymentTypeSelectorContainerComponent
  | InformationCenterPfrContainerComponent
  | ConfirmPersonalUserAddressComponent
  | ConfirmPersonalUserDataComponent
  | ConfirmPersonalUserPhoneEmailComponent
  | RegistrationAddrComponent
  | AddPassportContainerComponent
  | SelectChildrenScreenContainerComponent
  | FieldListScreenComponent
  | TimerScreenComponent
  | AppealFinesContainerComponent
  | MatPeriodContainerComponent
  | DateTimePeriodContainerComponent
  | CheckboxCubeContainerComponent;

type CustomScreenComponent =
  | MaskedAndPlainInputComponent
  | MvdGiacLookupComponent
  | DateInputComponent
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
  | FileUploadFormComponent;

export type ScreenComponentTypes = UniqueScreenComponent | CustomScreenComponent;

export const UNIQUE_SCREEN_COMPONENTS: Partial<Record<UniqueScreenComponentTypes, Type<UniqueScreenComponent>>> = {
  CityDepartment: InformationCenterMvdContainerComponent,
  UnusedPayments: UnusedPaymentsContainerComponent,
  MapService: SelectMapObjectComponent,
  FileUploadComponent: FileUploadScreenComponent,
  PhotoUploadComponent: UploadAndEditPhotoContainerComponent,
  EmployeeHistory: EmployeeHistoryContainerComponent,
  RepeatableFields: RepeatableFieldsComponent,
  TimeSlot: TimeSlotsComponent,
  CarInfo: CarInfoContainerComponent,
  CarList: CarListContainerComponent,
  CarOwnerInfo: CarOwnerInfoContainerComponent,
  EsepSign: SignatureApplicationContainerComponent,
  PaymentScr: PaymentComponent,
  BillInfo: BillInfoComponent,
  PaymentTypeSelector: PaymentTypeSelectorContainerComponent,
  InformationCenterPfr: InformationCenterPfrContainerComponent,
  ConfirmPersonalUserRegAddr: ConfirmPersonalUserAddressComponent,
  ConfirmPersonalUserData: ConfirmPersonalUserDataComponent,
  ConfirmAnotherUserData: ConfirmPersonalUserDataComponent,
  ConfirmChildData: ConfirmPersonalUserDataComponent,
  ConfirmPersonalUserEmail: ConfirmPersonalUserPhoneEmailComponent,
  ConfirmPersonalUserPhone: ConfirmPersonalUserPhoneEmailComponent,
  ConfirmLegalData: ConfirmPersonalUserDataComponent,
  ConfirmLegalPhone: ConfirmPersonalUserPhoneEmailComponent,
  ConfirmLegalEmail: ConfirmPersonalUserPhoneEmailComponent,
  RegistrationAddr: RegistrationAddrComponent,
  RegistrationLegalAddr: RegistrationAddrComponent,
  PassportLookup: AddPassportContainerComponent,
  ChildrenList: SelectChildrenScreenContainerComponent,
  ChildrenListUnder14: SelectChildrenScreenContainerComponent, // TODO: удалить потом как depricated
  ChildrenListAbove14: SelectChildrenScreenContainerComponent, //TODO: удалить потом как depricated
  FieldList: FieldListScreenComponent,
  Timer: TimerScreenComponent,
  AppealFines: AppealFinesContainerComponent,
  MatPeriod: MatPeriodContainerComponent,
  DateTimePeriod: DateTimePeriodContainerComponent,
  CheckboxCube: CheckboxCubeContainerComponent,
  ConfirmUserCorpEmail: ConfirmPersonalUserPhoneEmailComponent,
  ConfirmUserCorpPhone: ConfirmPersonalUserPhoneEmailComponent,
};

export const CUSTOM_SCREEN_COMPONENTS: Partial<Record<CustomScreenComponentTypes, Type<CustomScreenComponent>>> = {
  NewEmailInput: MaskedAndPlainInputComponent,
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
  TextArea: TextAreaComponent,
  Timer: TimerItemComponent,
  DocInput: DocInputComponent,
  FieldList: FieldListItemComponent,
  MultipleChoiceDictionary: MultiChoiceDictionaryComponent,
  CheckBoxList: CheckboxListComponent,
  CheckBox: CheckboxInputComponent,
  PassportLookup: PassportLookupComponent,
  CityInput: CityInputComponent,
  FileUploadComponent: FileUploadFormComponent,
};
