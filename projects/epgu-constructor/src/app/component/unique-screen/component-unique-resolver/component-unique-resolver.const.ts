import { Type } from '@angular/core';

import { ConfirmPersonalUserAddressComponent } from '../components/confirm-personal-user-address-screen/components/confirm-personal-user-address/confirm-personal-user-address.component';
import { ConfirmPersonalUserDataComponent } from '../components/confirm-personal-user-data-screen/component/confirm-personal-user-data/confirm-personal-user-data.component';
import { ConfirmPersonalUserPhoneEmailComponent } from '../components/confirm-personal-user-phone-email/confirm-personal-user-phone-email.component';
import { RegistrationAddrComponent } from '../components/registration-addr/components/registration-addr/registration-addr.component';
import { AddPassportContainerComponent } from '../components/add-passport/container/add-passport-component-container.component';
import { SelectChildrenScreenContainerComponent } from '../components/select-children/container/select-children-screen-container.component';
import { SelectMapObjectComponent } from '../components/select-map-object/select-map-object.component';
import { FileUploadScreenComponent } from '../components/file-upload-screen/file-upload-screen.component';
import { UploadAndEditPhotoContainerComponent } from '../components/upload-and-edit-photo/container/upload-and-edit-photo-container.component';
import { EmployeeHistoryContainerComponent } from '../components/employee-history/container/employee-history-container.component';
import { RepeatableScreenComponent } from '../../../screen/repeatable-screen/repeatable-screen.component';
import { TimeSlotsComponent } from '../components/time-slots/time-slots.component';
import { SignatureApplicationContainerComponent } from '../components/signature-application/components/container/signature-application-container.component';
import { PaymentComponent } from '../components/payment/components/payment/payment.component';
import { BillInfoComponent } from '../components/payment/components/billinfo/billinfo.component';
import { PaymentTypeSelectorContainerComponent } from '../components/payment-type-selector/components/payment-type-selector-container/payment-type-selector-container.component';
import { UnusedPaymentsContainerComponent } from '../components/unused-payments/container/unused-payments-container.component';
import { UniqueScreenComponentTypes } from '../unique-screen-components.types';
import { InformationCenterMvdContainerComponent } from '../components/information-center-mvd/container/information-center-mvd-container.component';
import { CarInfoContainerComponent } from '../components/car-info/containers/car-info-screen/car-info-container.component';
import { InformationCenterPfrContainerComponent } from '../components/information-center-pfr/container/information-center-pfr-container.component';
import { FieldListScreenComponent } from '../components/field-list-screen/field-list-screen.component';
import { TimerScreenComponent } from '../components/timer-screen/timer-screen.component';
import { CarListContainerComponent } from '../components/car-list/components/car-list-container/car-list-container.component';
import { CarOwnerInfoContainerComponent } from '../components/car-info/containers/car-owner-info-screen/car-owner-info-container.component';
import { CheckboxCubeContainerComponent } from '../components/checkbox-cube/checkbox-cube-container/checkbox-cube-container.component';
import { MatPeriodContainerComponent } from '../components/mat-period/mat-period-container/mat-period-container.component';
import { DateTimePeriodContainerComponent } from '../components/date-time-period/components/date-time-period-container/date-time-period-container.component';
import { ConfirmPersonalUserAddressReadonlyComponent } from '../components/confirm-personal-user-address-readonly-screen/components/confirm-personal-user-address-readonly/confirm-personal-user-address-readonly.component';
import { CarDetailInfoContainerComponent } from '../components/car-info/containers/car-detail-info/car-detail-info-container.component';
import {
  MedicalReferralsListContainerComponent
} from '../components/medical-referrals-list/container/medical-refferals-list-container.component';
import { PaymentWayContainerComponent } from '../components/payment-way/components/payment-way-container/payment-way-container.component';

export type ComponentTypes = UniqueScreenComponentTypes;

type UniqueScreenComponent =
  | InformationCenterMvdContainerComponent
  | UnusedPaymentsContainerComponent
  | SelectMapObjectComponent
  | FileUploadScreenComponent
  | UploadAndEditPhotoContainerComponent
  | EmployeeHistoryContainerComponent
  | RepeatableScreenComponent
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
  | MatPeriodContainerComponent
  | DateTimePeriodContainerComponent
  | CheckboxCubeContainerComponent
  | ConfirmPersonalUserAddressReadonlyComponent
  | CarDetailInfoContainerComponent
  | MedicalReferralsListContainerComponent
  | PaymentWayContainerComponent
  ;

export type ScreenComponentTypes = UniqueScreenComponent;

export const UNIQUE_SCREEN_COMPONENTS: Partial<Record<
  UniqueScreenComponentTypes,
  Type<UniqueScreenComponent>
>> = {
  CityDepartment: InformationCenterMvdContainerComponent,
  UnusedPayments: UnusedPaymentsContainerComponent,
  MapService: SelectMapObjectComponent,
  OrderFileProcessingComponent: FileUploadScreenComponent,
  FileUploadComponent: FileUploadScreenComponent,
  PhotoUploadComponent: UploadAndEditPhotoContainerComponent,
  EmployeeHistory: EmployeeHistoryContainerComponent,
  TimeSlot: TimeSlotsComponent,
  TimeSlotWithComputableDepartment: TimeSlotsComponent,
  CarInfo: CarInfoContainerComponent,
  CarList: CarListContainerComponent,
  CarOwnerInfo: CarOwnerInfoContainerComponent,
  EsepSign: SignatureApplicationContainerComponent,
  PaymentScr: PaymentComponent,
  BillInfo: BillInfoComponent,
  PaymentTypeSelector: PaymentTypeSelectorContainerComponent,
  InformationCenterPfr: InformationCenterPfrContainerComponent,
  InformationCenterPfrSop: InformationCenterPfrContainerComponent,
  ConfirmPersonalUserRegAddr: ConfirmPersonalUserAddressComponent,
  ConfirmPersonalUserRegReadOnlyAddr: ConfirmPersonalUserAddressReadonlyComponent,
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
  MatPeriod: MatPeriodContainerComponent,
  DateTimePeriod: DateTimePeriodContainerComponent,
  CheckboxCube: CheckboxCubeContainerComponent,
  ConfirmUserCorpEmail: ConfirmPersonalUserPhoneEmailComponent,
  ConfirmUserCorpPhone: ConfirmPersonalUserPhoneEmailComponent,
  CarDetailInfo: CarDetailInfoContainerComponent,
  MedicalReferrals: MedicalReferralsListContainerComponent,
  PaymentWay: PaymentWayContainerComponent,
};
