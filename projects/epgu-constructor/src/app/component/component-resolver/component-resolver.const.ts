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
import { SelectChildrenScreenComponent } from '../component-screen/components/select-children/select-children-screen.component';
import { ComponentScreenComponentTypes } from '../component-screen/component-screen-components.types';
import { Type } from '@angular/core';
import { SelectMapObjectComponent } from '../unique-screen/components/select-map-object/select-map-object.component';
import { FileUploadScreenComponent } from '../unique-screen/components/file-upload-screen/file-upload-screen.component';
// eslint-disable-next-line max-len
import { UploadAndEditPhotoComponent } from '../unique-screen/components/upload-and-edit-photo/upload-and-edit-photo.component';
import { EmployeeHistoryComponent } from '../unique-screen/components/employee-history/employee-history.component';
import { RepeatableFieldsComponent } from '../unique-screen/components/repeatable-fields/repeatable-fields.component';
import { TimeSlotsComponent } from '../unique-screen/components/time-slots/time-slots.component';
// eslint-disable-next-line max-len
import { SignatureApplicationContainerComponent } from '../unique-screen/components/signature-application/components/container/signature-application-container.component';
import { PaymentComponent } from '../unique-screen/components/payment/components/payment/payment.component';
import { BillInfoComponent } from '../unique-screen/components/payment/components/billinfo/billinfo.component';
// eslint-disable-next-line max-len
import { PaymentTypeSelectorComponent } from '../unique-screen/components/payment-type-selector/payment-type-selector.component';
// eslint-disable-next-line max-len
import { UnusedPaymentsContainerComponent } from '../unique-screen/components/unused-payments/unused-payments-container.component';
import { UniqueScreenComponentTypes } from '../unique-screen/unique-screen-components.types';
// eslint-disable-next-line max-len
import { InformationCenterMvdComponent } from '../unique-screen/components/information-center-mvd/information-center-mvd.component';
import { CarInfoContainerComponent } from '../unique-screen/components/car-info/containers/car-info-screen/car-info-container.component';

export type ComponentTypes = ComponentScreenComponentTypes | UniqueScreenComponentTypes;

export type ComponentScreenComponent = ConfirmPersonalUserAddressComponent
  | ConfirmPersonalUserDataComponent
  | ConfirmPersonalUserPhoneEmailComponent
  | RegistrationAddrComponent
  | AddPassportContainerComponent
  | SelectChildrenScreenComponent

  | InformationCenterMvdComponent
  | UnusedPaymentsContainerComponent
  | SelectMapObjectComponent
  | FileUploadScreenComponent
  | UploadAndEditPhotoComponent
  | EmployeeHistoryComponent
  | RepeatableFieldsComponent
  | TimeSlotsComponent
  | CarInfoContainerComponent
  | SignatureApplicationContainerComponent
  | PaymentComponent
  | BillInfoComponent
  | PaymentTypeSelectorComponent
  ;

export const COMPONENT_SCREEN_COMPONENTS: Partial<Record<ComponentTypes, Type<ComponentScreenComponent>>> = {
  ConfirmPersonalUserRegAddr: ConfirmPersonalUserAddressComponent,
  ConfirmPersonalUserData: ConfirmPersonalUserDataComponent,
  ConfirmAnotherUserData: ConfirmPersonalUserDataComponent,
  ConfirmChildData: ConfirmPersonalUserDataComponent,
  ConfirmPersonalUserEmail: ConfirmPersonalUserPhoneEmailComponent,
  ConfirmPersonalUserPhone: ConfirmPersonalUserPhoneEmailComponent,
  RegistrationAddr: RegistrationAddrComponent,
  PassportLookup: AddPassportContainerComponent,
  ChildrenList: SelectChildrenScreenComponent,
  ChildrenListUnder14: SelectChildrenScreenComponent, // TODO: удалить потом как depricated
  ChildrenListAbove14: SelectChildrenScreenComponent, //TODO: удалить потом как depricated

  CityDepartment: InformationCenterMvdComponent,
  UnusedPayments: UnusedPaymentsContainerComponent,
  MapService: SelectMapObjectComponent,
  FileUploadComponent: FileUploadScreenComponent,
  PhotoUploadComponent: UploadAndEditPhotoComponent,
  EmployeeHistory: EmployeeHistoryComponent,
  RepeatableFields: RepeatableFieldsComponent,
  TimeSlot: TimeSlotsComponent,
  CarInfo: CarInfoContainerComponent,
  EsepSign: SignatureApplicationContainerComponent,
  PaymentScr: PaymentComponent,
  BillInfo: BillInfoComponent,
  PaymentTypeSelector: PaymentTypeSelectorComponent,
};



