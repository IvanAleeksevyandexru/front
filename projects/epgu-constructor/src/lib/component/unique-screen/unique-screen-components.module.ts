import { NgModule } from '@angular/core';
import { DatesToolsService } from '@epgu/epgu-constructor-ui-kit';
import { EventBusService } from '@epgu/epgu-constructor-ui-kit';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { ModalModule } from '../../modal/modal.module';
import { BaseModule } from '../../shared/base.module';
import { WebcamShootModule } from '../../shared/components/webcam-shoot/webcam-shoot.module';
import { DictionaryApiService } from '../../shared/services/dictionary/dictionary-api.service';
import { CarInfoModule } from './components/car-info/car-info.module';
import { EmployeeHistoryModule } from './components/employee-history/employee-history.module';
import { FileUploadScreenModule } from './components/file-upload-screen/file-upload-screen.module';
import { InformationCenterMvdModule } from './components/information-center-mvd/information-center-mvd.module';
import { PaymentTypeSelectorModule } from './components/payment-type-selector/payment-type-selector.module';
import { BillinfoModule } from './components/payment/components/billinfo/billinfo.module';
import { PaymentModule } from './components/payment/components/payment/payment.module';
import { SelectMapObjectModule } from './components/select-map-object/select-map-object.module';
import { SignatureApplicationModule } from './components/signature-application/signature-application.module';
import { TimeSlotsModule } from './components/time-slots/time-slots.module';
import { UnusedPaymentsModule } from './components/unused-payments/unused-payments.module';
import { UploadAndEditPhotoModule } from './components/upload-and-edit-photo/upload-and-edit-photo.module';
import { WebcamService } from '../../core/services/webcam/webcam.service';
import { InformationCenterModule } from './components/information-center/information-center.module';
// eslint-disable-next-line max-len
import { ConfirmPersonalUserPhoneEmailModule } from './components/confirm-personal-user-phone-email/confirm-personal-user-phone-email.module';
// eslint-disable-next-line max-len
import { ConfirmPersonalUserAddressScreenModule } from './components/confirm-personal-user-address-screen/confirm-personal-user-address-screen.module';
// eslint-disable-next-line max-len
import { ConfirmPersonalUserDataScreenModule } from './components/confirm-personal-user-data-screen/confirm-personal-user-data-screen.module';
import { SelectChildrenScreenModule } from './components/select-children/select-children-screen.module';
import { RegistrationAddrScreenModule } from './components/registration-addr/registration-addr-screen.module';
import { ReferralNumberModule } from './components/referral-number/referral-number.module';
import { AddPassportModule } from './components/add-passport/add-passport.module';
import { ConstructorDropdownModule } from '@epgu/epgu-constructor-ui-kit';
import { BaseComponentsModule } from '../../shared/components/base-components/base-components.module';
import { FieldListScreenModule } from './components/field-list-screen/field-list-screen.module';
import { TimerScreenModule } from './components/timer-screen/timer-screen.module';
import { CarListModule } from './components/car-list/car-list.module';
import { MatPeriodModule } from './components/mat-period/mat-period.module';
import { DateTimePeriodModule } from './components/date-time-period/date-time-period.module';
import { CheckboxCubeModule } from './components/checkbox-cube/checkbox-cube.module';
// eslint-disable-next-line max-len
import { ConfirmPersonalUserAddressReadonlyScreenModule } from './components/confirm-personal-user-address-readonly-screen/confirm-personal-user-address-readonly-screen.module';
import { MedicalReferralsListModule } from './components/medical-referrals-list/medical-referrals-list.module';
import { DatePeriodModule } from './components/date-period/date-period.module';
import { PaymentWayModule } from './components/payment-way/payment-way.module';

@NgModule({
  imports: [
    BaseModule,
    WebcamShootModule,
    ModalModule,
    FileUploadScreenModule,
    SelectMapObjectModule,
    CarInfoModule,
    EmployeeHistoryModule,
    TimeSlotsModule,
    PaymentModule,
    BillinfoModule,
    UnusedPaymentsModule,
    SignatureApplicationModule,
    UploadAndEditPhotoModule,
    PaymentTypeSelectorModule,
    InformationCenterMvdModule,
    InformationCenterModule,
    ConfirmPersonalUserPhoneEmailModule,
    ConfirmPersonalUserAddressScreenModule,
    ConfirmPersonalUserAddressReadonlyScreenModule,
    ConfirmPersonalUserDataScreenModule,
    SelectChildrenScreenModule,
    RegistrationAddrScreenModule,
    ReferralNumberModule,
    AddPassportModule,
    ConstructorDropdownModule,
    BaseComponentsModule,
    FieldListScreenModule,
    TimerScreenModule,
    CarListModule,
    MatPeriodModule,
    CheckboxCubeModule,
    DateTimePeriodModule,
    MedicalReferralsListModule,
    PaymentWayModule,
    DatePeriodModule
  ],
  exports: [
    UploadAndEditPhotoModule,
    FileUploadScreenModule,
    SelectMapObjectModule,
    CarInfoModule,
    EmployeeHistoryModule,
    TimeSlotsModule,
    PaymentModule,
    BillinfoModule,
    UnusedPaymentsModule,
    SignatureApplicationModule,
    PaymentTypeSelectorModule,
    InformationCenterMvdModule,
    InformationCenterModule,
    ConfirmPersonalUserPhoneEmailModule,
    ConfirmPersonalUserAddressScreenModule,
    ConfirmPersonalUserAddressReadonlyScreenModule,
    ConfirmPersonalUserDataScreenModule,
    SelectChildrenScreenModule,
    RegistrationAddrScreenModule,
    ReferralNumberModule,
    AddPassportModule,
    FieldListScreenModule,
    TimerScreenModule,
    CarListModule,
    MatPeriodModule,
    CheckboxCubeModule,
    DateTimePeriodModule,
    MedicalReferralsListModule,
    DatePeriodModule,
    PaymentWayModule,
  ],
  providers: [
    WebcamService,
    DictionaryApiService,
    UnsubscribeService,
    EventBusService,
    DatesToolsService,
  ],
})
export class UniqueScreenComponentsModule {}
