import { NgModule } from '@angular/core';
import { DatesToolsService } from '../../core/services/dates-tools/dates-tools.service';
import { EventBusService } from '../../core/services/event-bus/event-bus.service';
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';
import { ModalModule } from '../../modal/modal.module';
import { BaseModule } from '../../shared/base.module';
import { WebcamShootModule } from '../../shared/components/webcam-shoot/webcam-shoot.module';
import { DictionaryApiService } from '../shared/services/dictionary-api/dictionary-api.service';
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
import { WebcamService } from './services/webcam/webcam.service';
import { RepeatableFieldsModule } from './components/repeatable-fields/repeatable-fields.module';
import { InformationCenterPfrModule } from './components/information-center-pfr/information-center-pfr.module';

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
