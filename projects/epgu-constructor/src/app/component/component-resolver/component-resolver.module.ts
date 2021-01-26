import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentResolverComponent } from './component-resolver.component';
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
import { ComponentScreenComponentsModule } from '../component-screen/component-screen-components.module';
import { UniqueScreenComponentsModule } from '../unique-screen/unique-screen-components.module';
import { InformationCenterMvdComponent } from '../unique-screen/components/information-center-mvd/information-center-mvd.component';
import { UnusedPaymentsContainerComponent } from '../unique-screen/components/unused-payments/unused-payments-container.component';
import { SelectMapObjectComponent } from '../unique-screen/components/select-map-object/select-map-object.component';
import { FileUploadScreenComponent } from '../unique-screen/components/file-upload-screen/file-upload-screen.component';
import { UploadAndEditPhotoComponent } from '../unique-screen/components/upload-and-edit-photo/upload-and-edit-photo.component';
import { EmployeeHistoryComponent } from '../unique-screen/components/employee-history/employee-history.component';
import { RepeatableFieldsComponent } from '../unique-screen/components/repeatable-fields/repeatable-fields.component';
import { TimeSlotsComponent } from '../unique-screen/components/time-slots/time-slots.component';
import { CarInfoContainerComponent } from '../unique-screen/components/car-info/containers/car-info-screen/car-info-container.component';
// eslint-disable-next-line max-len
import { SignatureApplicationContainerComponent } from '../unique-screen/components/signature-application/components/container/signature-application-container.component';
import { PaymentComponent } from '../unique-screen/components/payment/components/payment/payment.component';
import { BillInfoComponent } from '../unique-screen/components/payment/components/billinfo/billinfo.component';
// eslint-disable-next-line max-len
import { PaymentTypeSelectorContainerComponent } from '../unique-screen/components/payment-type-selector/components/payment-type-selector-container/payment-type-selector-container.component';

@NgModule({
  declarations: [ComponentResolverComponent],
  imports: [CommonModule, ComponentScreenComponentsModule, UniqueScreenComponentsModule],
  exports: [ComponentResolverComponent],
  entryComponents: [
    ConfirmPersonalUserAddressComponent,
    ConfirmPersonalUserDataComponent,
    ConfirmPersonalUserPhoneEmailComponent,
    RegistrationAddrComponent,
    AddPassportContainerComponent,
    SelectChildrenScreenContainerComponent,

    InformationCenterMvdComponent,
    UnusedPaymentsContainerComponent,
    SelectMapObjectComponent,
    FileUploadScreenComponent,
    UploadAndEditPhotoComponent,
    EmployeeHistoryComponent,
    RepeatableFieldsComponent,
    TimeSlotsComponent,
    CarInfoContainerComponent,
    SignatureApplicationContainerComponent,
    PaymentComponent,
    BillInfoComponent,
    PaymentTypeSelectorContainerComponent,
  ],
})
export class ComponentResolverModule {}
