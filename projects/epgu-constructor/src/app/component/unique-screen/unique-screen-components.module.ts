import { NgModule } from '@angular/core';
import { DatesToolsService } from '../../core/services/dates-tools/dates-tools.service';
import { EventBusService } from '../../core/services/event-bus/event-bus.service';
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';
import { ModalModule } from '../../modal/modal.module';
import { BaseModule } from '../../shared/base.module';
import { WebcamShootModule } from '../../shared/components/webcam-shoot/webcam-shoot.module';
import { DictionaryApiService } from '../../shared/services/dictionary/dictionary-api.service';
import { CarInfoModule } from './components/car-info/car-info.module';
import { EmployeeHistoryModule } from './components/employee-history/employee-history.module';
import { FileUploadModule } from './components/file-upload-screen/file-upload.module';
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
import { RepeatableFieldsModule } from './components/repeatable-fields/repeatable-fields.module';
import { InformationCenterPfrModule } from './components/information-center-pfr/information-center-pfr.module';
// eslint-disable-next-line max-len
import { ConfirmPersonalUserPhoneEmailModule } from './components/confirm-personal-user-phone-email/confirm-personal-user-phone-email.module';
// eslint-disable-next-line max-len
import { ConfirmPersonalUserAddressScreenModule } from './components/confirm-personal-user-address-screen/confirm-personal-user-address-screen.module';
// eslint-disable-next-line max-len
import { ConfirmPersonalUserDataScreenModule } from './components/confirm-personal-user-data-screen/confirm-personal-user-data-screen.module';
import { SelectChildrenScreenModule } from './components/select-children/select-children-screen.module';
import { RegistrationAddrScreenModule } from './components/registration-addr/registration-addr-screen.module';
import { AddPassportModule } from './components/add-passport/add-passport.module';
import { ConstructorDropdownModule } from '../../shared/components/constructor-dropdown/constructor-dropdown.module';
import { BaseComponentsModule } from '../../shared/components/base-components/base-components.module';
import { FieldListScreenModule } from './components/field-list-screen/field-list-screen.module';
import { TimerScreenModule } from './components/timer-screen/timer-screen.module';
import { CarListModule } from './components/car-list/car-list.module';
import { AppealFinesModule } from './components/appeal-fines/appeal-fines.module';

@NgModule({
  imports: [
    BaseModule,
    WebcamShootModule,
    ModalModule,
    FileUploadModule,
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
    RepeatableFieldsModule,
    InformationCenterPfrModule,
    ConfirmPersonalUserPhoneEmailModule,
    ConfirmPersonalUserAddressScreenModule,
    ConfirmPersonalUserDataScreenModule,
    SelectChildrenScreenModule,
    RegistrationAddrScreenModule,
    AddPassportModule,
    ConstructorDropdownModule,
    BaseComponentsModule,
    FieldListScreenModule,
    TimerScreenModule,
    CarListModule,
    AppealFinesModule,
  ],
  exports: [
    RepeatableFieldsModule,
    UploadAndEditPhotoModule,
    FileUploadModule,
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
    InformationCenterPfrModule,
    ConfirmPersonalUserPhoneEmailModule,
    ConfirmPersonalUserAddressScreenModule,
    ConfirmPersonalUserDataScreenModule,
    SelectChildrenScreenModule,
    RegistrationAddrScreenModule,
    AddPassportModule,
    FieldListScreenModule,
    TimerScreenModule,
    CarListModule,
    AppealFinesModule,
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
