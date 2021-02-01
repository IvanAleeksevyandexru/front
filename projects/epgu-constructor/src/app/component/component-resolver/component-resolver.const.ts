// eslint-disable-next-line max-len
import { ConfirmPersonalUserAddressComponent } from '../component-screen/components/confirm-personal-user/screens/confirm-personal-user-address-screen/components/confirm-personal-user-address/confirm-personal-user-address.component';
// eslint-disable-next-line max-len
import { ConfirmPersonalUserDataComponent } from '../component-screen/components/confirm-personal-user/screens/confirm-personal-user-data-screen/component/confirm-personal-user-data/confirm-personal-user-data.component';
// eslint-disable-next-line max-len
import { ConfirmPersonalUserPhoneEmailComponent } from '../component-screen/components/confirm-personal-user/screens/confirm-personal-user-phone-email/confirm-personal-user-phone-email.component';
// eslint-disable-next-line max-len
import { RegistrationAddrComponent } from '../component-screen/components/confirm-personal-user/screens/registration-addr/components/registration-addr/registration-addr.component';
// eslint-disable-next-line max-len
import { AddPassportContainerComponent } from '../component-screen/components/add-passport/container/add-passport-component-container.component';
// eslint-disable-next-line max-len
import { SelectChildrenScreenContainerComponent } from '../component-screen/components/select-children/container/select-children-screen-container.component';
import { ComponentScreenComponentTypes } from '../component-screen/component-screen-components.types';
import { Type } from '@angular/core';
import { SelectMapObjectComponent } from '../unique-screen/components/select-map-object/select-map-object.component';
import { FileUploadScreenComponent } from '../unique-screen/components/file-upload-screen/file-upload-screen.component';
// eslint-disable-next-line max-len
import { UploadAndEditPhotoComponent } from '../unique-screen/components/upload-and-edit-photo/upload-and-edit-photo.component';
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
import { UnusedPaymentsContainerComponent } from '../unique-screen/components/unused-payments/unused-payments-container.component';
import { UniqueScreenComponentTypes } from '../unique-screen/unique-screen-components.types';
// eslint-disable-next-line max-len
import { InformationCenterMvdComponent } from '../unique-screen/components/information-center-mvd/information-center-mvd.component';
import { CarInfoContainerComponent } from '../unique-screen/components/car-info/containers/car-info-screen/car-info-container.component';
// eslint-disable-next-line max-len
import { InformationCenterPfrContainerComponent } from '../unique-screen/components/information-center-pfr/container/information-center-pfr-container.component';
import { FieldListScreenComponent } from '../component-screen/components/field-list-screen/field-list-screen.component';
import { TimerScreenComponent } from '../component-screen/components/timer-screen/timer-screen.component';
import { CarListContainerComponent } from '../unique-screen/components/car-list/components/car-list-container/car-list-container.component';

export type ComponentTypes = ComponentScreenComponentTypes | UniqueScreenComponentTypes;

type ComponentScreenComponent =
  ConfirmPersonalUserAddressComponent
  | ConfirmPersonalUserDataComponent
  | ConfirmPersonalUserPhoneEmailComponent
  | RegistrationAddrComponent
  | AddPassportContainerComponent
  | SelectChildrenScreenContainerComponent
  | FieldListScreenComponent
  | TimerScreenComponent;

type UniqueScreenComponent =
  InformationCenterMvdComponent
  | UnusedPaymentsContainerComponent
  | SelectMapObjectComponent
  | FileUploadScreenComponent
  | UploadAndEditPhotoComponent
  | EmployeeHistoryContainerComponent
  | RepeatableFieldsComponent
  | TimeSlotsComponent
  | CarInfoContainerComponent
  | CarListContainerComponent
  | SignatureApplicationContainerComponent
  | PaymentComponent
  | BillInfoComponent
  | PaymentTypeSelectorContainerComponent
  | InformationCenterPfrContainerComponent;

export type ScreenComponentTypes = ComponentScreenComponent | UniqueScreenComponent;

export const COMPONENT_SCREEN_COMPONENTS: Partial<Record<
  ComponentScreenComponentTypes,
  Type<ComponentScreenComponent>
>> = {
  ConfirmPersonalUserRegAddr: ConfirmPersonalUserAddressComponent,
  ConfirmPersonalUserData: ConfirmPersonalUserDataComponent,
  ConfirmAnotherUserData: ConfirmPersonalUserDataComponent,
  ConfirmChildData: ConfirmPersonalUserDataComponent,
  ConfirmPersonalUserEmail: ConfirmPersonalUserPhoneEmailComponent,
  ConfirmPersonalUserPhone: ConfirmPersonalUserPhoneEmailComponent,
  RegistrationAddr: RegistrationAddrComponent,
  PassportLookup: AddPassportContainerComponent,
  ChildrenList: SelectChildrenScreenContainerComponent,
  ChildrenListUnder14: SelectChildrenScreenContainerComponent, // TODO: удалить потом как depricated
  ChildrenListAbove14: SelectChildrenScreenContainerComponent, //TODO: удалить потом как depricated
  FieldList: FieldListScreenComponent,
  Timer: TimerScreenComponent,
};

export const UNIQUE_SCREEN_COMPONENTS: Partial<Record<UniqueScreenComponentTypes, Type<UniqueScreenComponent>>> = {
  CityDepartment: InformationCenterMvdComponent,
  UnusedPayments: UnusedPaymentsContainerComponent,
  MapService: SelectMapObjectComponent,
  FileUploadComponent: FileUploadScreenComponent,
  PhotoUploadComponent: UploadAndEditPhotoComponent,
  EmployeeHistory: EmployeeHistoryContainerComponent,
  RepeatableFields: RepeatableFieldsComponent,
  TimeSlot: TimeSlotsComponent,
  CarInfo: CarInfoContainerComponent,
  CarList: CarListContainerComponent,
  EsepSign: SignatureApplicationContainerComponent,
  PaymentScr: PaymentComponent,
  BillInfo: BillInfoComponent,
  PaymentTypeSelector: PaymentTypeSelectorContainerComponent,
  InformationCenterPfr: InformationCenterPfrContainerComponent,
};
